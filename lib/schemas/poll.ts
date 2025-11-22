import { z } from 'zod';

export const createPollSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  options: z.array(
    z.object({
      text: z.string().min(1, 'Option text is required').max(200, 'Option too long'),
    })
  ).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
});

export const voteSchema = z.object({
  optionId: z.string().min(1, 'Option is required'),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
