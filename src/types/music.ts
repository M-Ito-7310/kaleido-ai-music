// Music Track Type Definitions

export interface MusicTrack {
  id: string
  title: string
  description: string | null
  categoryId: number
  fileUrl: string
  thumbnailUrl: string | null
  duration: number | null // seconds
  fileSize: number | null // bytes
  generatedBy: string | null
  playCount: number
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: Date
}

export interface Tag {
  id: number
  name: string
  slug: string
  createdAt: Date
}

export interface MusicWithDetails extends MusicTrack {
  category: Category
  tags: Tag[]
}
