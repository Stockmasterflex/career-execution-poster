import { z } from 'zod'

export const scheduleBlockSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  tag: z.enum(['gym', 'market', 'study', 'network', 'content', 'meal', 'family']),
  day: z.number().min(0).max(6),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  details: z.string().optional(),
})

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  tier: z.enum(['T1A', 'T1B', 'T2']),
  status: z.enum(['Lead', 'Applied', 'Interview', 'Offer', 'Rejected']),
  notes: z.string().optional(),
})

export const kpiUpdateSchema = z.object({
  current_value: z.number().min(0),
  target_value: z.number().min(0),
})

export const nonNegotiableSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  type: z.enum(['morning', 'evening']),
})

export type ScheduleBlock = z.infer<typeof scheduleBlockSchema>
export type Company = z.infer<typeof companySchema>
export type KpiUpdate = z.infer<typeof kpiUpdateSchema>
export type NonNegotiable = z.infer<typeof nonNegotiableSchema>