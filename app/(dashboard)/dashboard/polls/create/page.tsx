'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createPollSchema, type CreatePollInput } from '@/lib/schemas/poll';
import { useAppDispatch } from '@/store/hooks';
import { addPoll } from '@/features/polls/pollsSlice';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function CreatePoll() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePollInput>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: '',
      description: '',
      options: [{ text: '' }, { text: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const options = watch('options');
  const canAddMore = options.length < 6;

  const onSubmit = async (data: CreatePollInput) => {
    setLoading(true);
    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newPoll = await response.json();
        dispatch(addPoll(newPoll));
        router.push('/dashboard');
      } else {
        throw new Error('Failed to create poll');
      }
    } catch (error) {
      console.error('Failed to create poll:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Poll</h1>
          <p className="text-gray-600">Create engaging polls for your audience</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Information</CardTitle>
          <CardDescription>
            Enter your poll question and options. You can add up to 6 options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Input */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Poll Question *
              </label>
              <Input
                {...register('question')}
                type="text"
                placeholder="What's your favorite programming language?"
                error={errors.question?.message}
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-colors duration-200"
                placeholder="Add a brief description about your poll..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Poll Options *
                </label>
                <span className="text-sm text-gray-500">
                  {options.length}/6 options
                </span>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        {...register(`options.${index}.text` as const)}
                        placeholder={`Option ${index + 1}`}
                        error={errors.options?.[index]?.text?.message}
                      />
                    </div>
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {errors.options?.message && (
                <p className="mt-2 text-sm text-red-600">{errors.options.message}</p>
              )}

              {canAddMore && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ text: '' })}
                  className="mt-4"
                  icon={Plus}
                >
                  Add Option
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link href="/dashboard">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={loading}>
                Create Poll
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tips for Great Polls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Keep questions clear and concise</li>
            <li>• Use mutually exclusive options</li>
            <li>• Limit to 4-6 options for better engagement</li>
            <li>• Consider your audience when crafting options</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
