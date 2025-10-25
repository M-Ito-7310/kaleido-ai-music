# Phase 10: Social Features

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 3-4 hours

## Overview
ソーシャル機能の実装。楽曲共有、コラボレーティブプレイリスト、リアルタイム同期再生、コメント・リアクション機能により、ユーザー間の交流を促進します。

## Technologies to Use
- Supabase Realtime (real-time collaboration)
- PeerJS (WebRTC wrapper)
- Web Share API (native sharing)
- Socket.io (optional fallback)
- React Context (social state management)

## Dependencies to Add

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "peerjs": "^1.5.2"
}
```

## Files to Create/Modify

### Create
1. **components/social/ShareButton.tsx** - Share track button with Web Share API
2. **components/social/CollaborativePlaylist.tsx** - Real-time collaborative playlist
3. **components/social/ListenTogether.tsx** - Synchronized playback component
4. **components/social/CommentSection.tsx** - Track comments component
5. **components/social/ReactionBar.tsx** - Emoji reactions component
6. **components/social/UserProfile.tsx** - Public user profile page
7. **lib/realtime/supabase.ts** - Supabase Realtime client setup
8. **lib/webrtc/peerConnection.ts** - WebRTC peer connection management
9. **lib/api/social.ts** - Social API endpoints
10. **hooks/useLiveCursor.ts** - Real-time cursor tracking in playlists
11. **hooks/usePresence.ts** - User presence tracking

### Modify
- components/music/MusicCard.tsx - Add share button
- app/(pages)/library/page.tsx - Add collaborative playlist option

## Key Features to Implement

### 1. Share Track with Web Share API

```typescript
'use client';

import { Share2 } from 'lucide-react';
import { Music } from '@/lib/db/schema';

interface ShareButtonProps {
  track: Music;
}

export function ShareButton({ track }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: `${track.title} - ${track.artist}`,
      text: `Check out this track on Kaleido AI Music!`,
      url: `${window.location.origin}/track/${track.id}`,
    };

    try {
      if (navigator.share) {
        // Native share API (mobile)
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
      aria-label={`Share ${track.title}`}
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
```

### 2. Collaborative Playlist with Supabase Realtime

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Music } from '@/lib/db/schema';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CollaborativePlaylistProps {
  playlistId: string;
}

export function CollaborativePlaylist({ playlistId }: CollaborativePlaylistProps) {
  const [tracks, setTracks] = useState<Music[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to playlist changes
    const channel = supabase
      .channel(`playlist:${playlistId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlist_tracks',
          filter: `playlist_id=eq.${playlistId}`
        },
        (payload) => {
          console.log('Playlist changed:', payload);

          if (payload.eventType === 'INSERT') {
            // Add new track
            setTracks((prev) => [...prev, payload.new as Music]);
          } else if (payload.eventType === 'DELETE') {
            // Remove track
            setTracks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state).map((key) => state[key][0].username);
        setCollaborators(users);
      })
      .subscribe();

    // Track own presence
    channel.track({
      username: 'current-user', // Replace with actual username
      online_at: new Date().toISOString(),
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playlistId]);

  const addTrack = async (track: Music) => {
    const { error } = await supabase
      .from('playlist_tracks')
      .insert({ playlist_id: playlistId, track_id: track.id });

    if (error) {
      console.error('Failed to add track:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Collaborative Playlist</h2>

        {/* Collaborators */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''} online
          </span>
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map((user, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-DEFAULT flex items-center justify-center text-white text-sm font-semibold border-2 border-white dark:border-gray-900"
              >
                {user[0].toUpperCase()}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-900">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg"
          >
            <img
              src={track.imageUrl}
              alt={track.title}
              className="w-12 h-12 rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-gray-500">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Listen Together with WebRTC

```typescript
'use client';

import { useEffect, useState, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { Users } from 'lucide-react';

export function ListenTogether() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [isHost, setIsHost] = useState(false);

  const { currentTrack, isPlaying, currentTime, playTrack, togglePlayPause, seekTo } = usePlayer();

  useEffect(() => {
    // Initialize PeerJS
    const newPeer = new Peer();

    newPeer.on('open', (id) => {
      setPeerId(id);
      console.log('My peer ID:', id);
    });

    newPeer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer);
      setConnections((prev) => [...prev, conn]);

      setupConnection(conn);
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const setupConnection = (conn: DataConnection) => {
    conn.on('data', (data: any) => {
      console.log('Received data:', data);

      if (data.type === 'PLAY') {
        playTrack(data.track, data.playlist);
      } else if (data.type === 'PAUSE') {
        if (isPlaying) togglePlayPause();
      } else if (data.type === 'RESUME') {
        if (!isPlaying) togglePlayPause();
      } else if (data.type === 'SEEK') {
        seekTo(data.time);
      }
    });

    conn.on('close', () => {
      setConnections((prev) => prev.filter((c) => c !== conn));
    });
  };

  const createSession = () => {
    setIsHost(true);
    // Display peer ID for others to join
  };

  const joinSession = (hostPeerId: string) => {
    if (!peer) return;

    const conn = peer.connect(hostPeerId);

    conn.on('open', () => {
      console.log('Connected to host:', hostPeerId);
      setConnections([conn]);
      setupConnection(conn);
    });
  };

  const broadcastToAll = (data: any) => {
    connections.forEach((conn) => {
      if (conn.open) {
        conn.send(data);
      }
    });
  };

  // Sync playback when host plays a track
  useEffect(() => {
    if (!isHost || !currentTrack) return;

    broadcastToAll({
      type: 'PLAY',
      track: currentTrack,
      playlist: [], // Include full playlist if needed
    });
  }, [currentTrack, isHost]);

  // Sync play/pause state
  useEffect(() => {
    if (!isHost) return;

    broadcastToAll({
      type: isPlaying ? 'RESUME' : 'PAUSE',
    });
  }, [isPlaying, isHost]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Listen Together</h2>
      </div>

      {!peer && <p>Connecting...</p>}

      {peer && !isHost && connections.length === 0 && (
        <div className="space-y-4">
          <button
            onClick={createSession}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
          >
            Create Session
          </button>

          <div>
            <input
              type="text"
              placeholder="Enter host's ID to join"
              className="w-full px-4 py-2 border rounded-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  joinSession(e.currentTarget.value);
                }
              }}
            />
          </div>
        </div>
      )}

      {isHost && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Share this ID with friends:
            </p>
            <p className="text-2xl font-mono font-bold">{peerId}</p>
            <button
              onClick={() => navigator.clipboard.writeText(peerId)}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700"
            >
              Copy ID
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {connections.length} listener{connections.length !== 1 ? 's' : ''} connected
            </p>
          </div>
        </div>
      )}

      {connections.length > 0 && !isHost && (
        <div className="space-y-2">
          <p className="text-green-600 dark:text-green-400">
            ✓ Connected to host
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Playback is synchronized with the host
          </p>
        </div>
      )}
    </div>
  );
}
```

### 4. Comments & Reactions

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ThumbsUp, Smile } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function CommentSection({ trackId }: { trackId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '❤️', count: 0, userReacted: false },
    { emoji: '🔥', count: 0, userReacted: false },
    { emoji: '👍', count: 0, userReacted: false },
    { emoji: '😍', count: 0, userReacted: false },
  ]);

  useEffect(() => {
    loadComments();
    loadReactions();

    // Subscribe to new comments
    const channel = supabase
      .channel(`comments:${trackId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'track_comments',
          filter: `track_id=eq.${trackId}`
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trackId]);

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('track_comments')
      .select('*')
      .eq('track_id', trackId)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data as Comment[]);
    }
  };

  const loadReactions = async () => {
    const { data, error } = await supabase
      .from('track_reactions')
      .select('emoji, count')
      .eq('track_id', trackId);

    if (data) {
      // Update reaction counts
      // Implementation depends on your schema
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('track_comments')
      .insert({
        track_id: trackId,
        user: 'current-user', // Replace with actual user
        text: newComment,
      });

    if (!error) {
      setNewComment('');
    }
  };

  const toggleReaction = async (emoji: string) => {
    // Toggle user's reaction in database
    const reaction = reactions.find((r) => r.emoji === emoji);
    if (!reaction) return;

    const { error } = await supabase
      .from('track_reactions')
      .upsert({
        track_id: trackId,
        user_id: 'current-user', // Replace
        emoji,
        reacted: !reaction.userReacted,
      });

    if (!error) {
      setReactions((prev) =>
        prev.map((r) =>
          r.emoji === emoji
            ? {
                ...r,
                count: r.count + (r.userReacted ? -1 : 1),
                userReacted: !r.userReacted,
              }
            : r
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Reactions */}
      <div className="flex gap-2">
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => toggleReaction(reaction.emoji)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
              reaction.userReacted
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-xl">{reaction.emoji}</span>
            {reaction.count > 0 && (
              <span className="text-sm font-semibold">{reaction.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Comment input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addComment();
            }
          }}
        />
        <button
          onClick={addComment}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
        >
          Post
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-DEFAULT flex items-center justify-center text-white font-semibold">
              {comment.user[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <p className="font-semibold text-sm">{comment.user}</p>
                <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. User Profile

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Music, Heart, ListMusic } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface UserProfileData {
  username: string;
  avatar: string;
  bio: string;
  stats: {
    totalListens: number;
    favoriteTracks: number;
    playlists: number;
  };
  topTracks: Music[];
  recentlyPlayed: Music[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function UserProfile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data as UserProfileData);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile header */}
      <div className="flex items-start gap-6">
        <img
          src={profile.avatar}
          alt={profile.username}
          className="w-32 h-32 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.bio}</p>

          {/* Stats */}
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-bold">{profile.stats.totalListens}</p>
              <p className="text-sm text-gray-500">Total listens</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.favoriteTracks}</p>
              <p className="text-sm text-gray-500">Favorites</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.playlists}</p>
              <p className="text-sm text-gray-500">Playlists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top tracks */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Music className="w-6 h-6" />
          Top Tracks
        </h2>
        <div className="grid gap-4">
          {profile.topTracks.map((track, index) => (
            <div key={track.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <span className="text-2xl font-bold text-gray-400">{index + 1}</span>
              <img src={track.imageUrl} alt={track.title} className="w-16 h-16 rounded" />
              <div className="flex-1">
                <p className="font-semibold">{track.title}</p>
                <p className="text-sm text-gray-500">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently played */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ListMusic className="w-6 h-6" />
          Recently Played
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile.recentlyPlayed.map((track) => (
            <div key={track.id} className="group cursor-pointer">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                <img
                  src={track.imageUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="font-semibold text-sm truncate">{track.title}</p>
              <p className="text-xs text-gray-500 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Technical Highlights

### Supabase Realtime Setup

```typescript
// lib/realtime/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10, // Rate limiting
      },
    },
  }
);

// Enable realtime for specific tables
export async function enableRealtime(tableName: string) {
  const { error } = await supabase.rpc('enable_realtime', {
    table_name: tableName,
  });

  if (error) {
    console.error('Failed to enable realtime:', error);
  }
}
```

### WebRTC Connection Management

```typescript
// lib/webrtc/peerConnection.ts
import Peer, { DataConnection } from 'peerjs';

export class PeerConnectionManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();

  async initialize(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add TURN servers for better connectivity
          ],
        },
      });

      this.peer.on('open', (id) => {
        resolve(id);
      });

      this.peer.on('error', (error) => {
        reject(error);
      });

      this.peer.on('connection', (conn) => {
        this.handleConnection(conn);
      });
    });
  }

  connect(peerId: string): Promise<DataConnection> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer not initialized'));
        return;
      }

      const conn = this.peer.connect(peerId, {
        reliable: true, // Use reliable data channel
      });

      conn.on('open', () => {
        this.handleConnection(conn);
        resolve(conn);
      });

      conn.on('error', (error) => {
        reject(error);
      });
    });
  }

  private handleConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });
  }

  broadcast(data: any) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(data);
      }
    });
  }

  disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}
```

## Database Schema (Supabase)

```sql
-- Users table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaborative playlists
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES user_profiles(id),
  is_collaborative BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  track_id INTEGER NOT NULL,
  added_by UUID REFERENCES user_profiles(id),
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE track_comments (
  id SERIAL PRIMARY KEY,
  track_id INTEGER NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions
CREATE TABLE track_reactions (
  id SERIAL PRIMARY KEY,
  track_id INTEGER NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track_id, user_id, emoji)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_reactions ENABLE ROW LEVEL SECURITY;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE playlist_tracks;
ALTER PUBLICATION supabase_realtime ADD TABLE track_comments;
```

## Accessibility

- Share button: ARIA label with track info
- Comments: Keyboard navigation for posting
- Reactions: ARIA labels for each emoji
- Listen Together: Screen reader announcements for connection status
- User profiles: Alt text for avatars

## Performance

- Supabase connection pooling
- WebRTC: TURN server for NAT traversal
- Debounce realtime updates (max 10/second)
- Paginate comments (20 per page)
- Cache user profiles (5 min TTL)

## Browser Compatibility

- Web Share API: Chrome 61+, Safari 12.2+
- WebRTC: All modern browsers
- Supabase Realtime: All modern browsers with WebSocket

## Security

- Row Level Security (RLS) on all tables
- User authentication required for actions
- Rate limiting on comments/reactions
- Input sanitization for XSS prevention

## Next Steps
➡️ Phase 11: Gamification

## Notes
- Supabase Realtimeでリアルタイムコラボレーション
- WebRTCで同期再生機能を実現
- Web Share APIでネイティブ共有
- コメント・リアクションでコミュニティ形成
- ユーザープロフィールで個性を表現
