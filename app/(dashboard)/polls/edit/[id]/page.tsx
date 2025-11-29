'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { 
  Plus, Trash2, ArrowLeft, Lightbulb, 
  BarChart3, Settings, Globe, Users, Shield, Calendar,
  Save, Edit, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePoll } from '@/features/polls/pollsSlice';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';

interface PollFormData {
  question: string;
  description: string;
  options: { id?: string; text: string; votes?: number }[];
}

interface PollSettings {
  isPublic: boolean;
  allowMultipleVotes: boolean;
  requireEmail: boolean;
  showResults: boolean;
  endDate: string;
}

export default function EditPoll() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pollSettings, setPollSettings] = useState<PollSettings>({
    isPublic: true,
    allowMultipleVotes: false,
    requireEmail: false,
    showResults: true,
    endDate: '',
  });

  const router = useRouter();
  const params = useParams();
  const pollId = params.id as string;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { polls } = useAppSelector(state => state.polls);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<PollFormData>({
    defaultValues: {
      question: '',
      description: '',
      options: [{ text: '' }, { text: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'options',
  });

  const options = watch('options');
  const question = watch('question');
  const description = watch('description');

  const canAddMore = options.length < 8;
  const hasEmptyOptions = options.some(option => !option.text.trim());
  const isValidForm = !hasEmptyOptions && question.trim() && options.length >= 2;

  useEffect(() => {
    const fetchPollForEdit = async () => {
      try {
        setFetchLoading(true);
        
        const response = await fetch(`/api/polls/${pollId}`);
        if (response.ok) {
          const pollData = await response.json();
          populateForm(pollData);
        } else {
          throw new Error('Poll not found');
        }
      } catch (error) {
        console.error('Failed to fetch poll for editing:', error);
        alert('Failed to load poll for editing. Please try again.');
        router.push('/dashboard');
      } finally {
        setFetchLoading(false);
      }
    };

    if (pollId && user) {
      fetchPollForEdit();
    }
  }, [pollId, user, router]);

  const populateForm = (pollData: any) => {
    // Set basic fields
    setValue('question', pollData.question || '');
    setValue('description', pollData.description || '');
    
    // Set options using replace
    if (pollData.options && Array.isArray(pollData.options)) {
      const formattedOptions = pollData.options.map((option: any) => ({
        id: option.id,
        text: option.text || '',
        votes: option.votes || 0
      }));
      replace(formattedOptions);
    }

    // Set settings
    if (pollData.settings) {
      setPollSettings({
        isPublic: pollData.settings.isPublic ?? true,
        allowMultipleVotes: pollData.settings.allowMultipleVotes ?? false,
        requireEmail: pollData.settings.requireEmail ?? false,
        showResults: pollData.settings.showResults ?? true,
        endDate: pollData.settings.endDate || '',
      });
    }
  };

  const onSubmit = async (data: PollFormData) => {
    if (!user) {
      alert('You must be logged in to edit polls.');
      return;
    }

    setLoading(true);
    try {
      const pollData = {
        question: data.question.trim(),
        description: data.description?.trim() || '',
        options: data.options
          .filter(opt => opt.text.trim())
          .map(opt => ({
            id: opt.id,
            text: opt.text.trim(),
            votes: opt.votes || 0
          })),
        settings: pollSettings,
      };

      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update poll');
      }

      const responseData = await response.json();
      dispatch(updatePoll({ id: pollId, ...responseData }));
      alert('Poll updated successfully!');
      router.push(`/polls/${pollId}`);
    } catch (error: any) {
      console.error('Poll update error:', error);
      alert(error.message || 'Failed to update poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (canAddMore) {
      append({ text: '' });
    }
  };

  const presetTemplates = {
    rating: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    agreement: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
    satisfaction: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
  };

  const quickAddOptions = (presetOptions: string[]) => {
    replace(presetOptions.map(option => ({ text: option })));
  };

  const getFormProgress = () => {
    let progress = 0;
    if (question.trim()) progress += 40;
    if (options.length >= 2 && !hasEmptyOptions) progress += 40;
    if (description.trim()) progress += 10;
    if (pollSettings.endDate) progress += 10;
    return progress;
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading poll for editing...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <Link
              href={`/polls/${pollId}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 group transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to poll
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold dark:text-white bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Edit Poll
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Update your poll question, options, and settings
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{options.length}</div>
              <div className="text-xs text-gray-500">Options</div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{8 - options.length}</div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getFormProgress()}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center text-2xl">
                  <Edit className="h-6 w-6 mr-3 text-green-600" />
                  Edit Poll Information
                </CardTitle>
                <CardDescription className="text-lg">
                  Update your poll question and voting options
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Question */}
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                      Poll Question *
                    </label>
                    <Input
                      {...register('question', { required: 'Question is required' })}
                      placeholder="What's your favorite programming language?"
                      className="text-lg py-3 px-4 border-2 focus:border-green-500 transition-colors"
                    />
                    {errors.question && (
                      <p className="text-red-600 text-sm font-medium">{errors.question.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                      Description (Optional)
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 resize-none text-lg"
                      placeholder="Add context or additional information about your poll..."
                      maxLength={250}
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                        Poll Options *
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 font-medium">
                          {options.length}/8 options
                        </span>
                        <Badge variant={hasEmptyOptions ? "warning" : "success"} className="text-sm">
                          {hasEmptyOptions ? "Incomplete" : "Ready"}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Quick Templates */}
                    <div className="space-y-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Templates:</span>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(presetTemplates).map(([key, template]) => (
                          <Button
                            key={key}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => quickAddOptions(template)}
                            className="text-sm capitalize border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          >
                            {key}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-4 group">
                          <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Input
                              {...register(`options.${index}.text`, { 
                                required: 'Option text is required' 
                              })}
                              placeholder={`Option ${index + 1}`}
                              className="text-lg py-3 border-2 focus:border-green-500 transition-colors"
                            />
                            {field.votes !== undefined && field.votes > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {field.votes} current votes
                              </p>
                            )}
                          </div>
                          {fields.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"
                              disabled={field.votes !== undefined && field.votes > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Option Button */}
                    {canAddMore && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addOption}
                        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors py-4 text-lg"
                        icon={Plus}
                      >
                        Add Option ({8 - options.length} remaining)
                      </Button>
                    )}
                  </div>

                  {/* Advanced Settings */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center space-x-3 text-lg font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors w-full group"
                    >
                      <div className={`p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors ${showAdvanced ? 'rotate-180' : ''}`}>
                        <Settings className="h-5 w-5" />
                      </div>
                      <span>Advanced Settings</span>
                      <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''} ml-auto`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {showAdvanced && (
                      <div className="mt-6 space-y-6 p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-green-600" />
                          Poll Settings
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                              <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                                  <Globe className="h-4 w-4 mr-2" />
                                  Public Poll
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Anyone can see and vote</p>
                              </div>
                              <Toggle
                                checked={pollSettings.isPublic}
                                onCheckedChange={(checked) => setPollSettings(prev => ({ ...prev, isPublic: checked }))}
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                              <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  Multiple Votes
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Allow users to vote multiple times</p>
                              </div>
                              <Toggle
                                checked={pollSettings.allowMultipleVotes}
                                onCheckedChange={(checked) => setPollSettings(prev => ({ ...prev, allowMultipleVotes: checked }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                              <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                                  <Shield className="h-4 w-4 mr-2" />
                                  Require Email
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Voters must provide email</p>
                              </div>
                              <Toggle
                                checked={pollSettings.requireEmail}
                                onCheckedChange={(checked) => setPollSettings(prev => ({ ...prev, requireEmail: checked }))}
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                              <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  Show Results
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Display results to voters</p>
                              </div>
                              <Toggle
                                checked={pollSettings.showResults}
                                onCheckedChange={(checked) => setPollSettings(prev => ({ ...prev, showResults: checked }))}
                              />
                            </div>
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Set End Date (Optional)
                          </label>
                          <Input
                            type="datetime-local"
                            value={pollSettings.endDate}
                            onChange={(e) => setPollSettings(prev => ({ ...prev, endDate: e.target.value }))}
                            className="border-2 focus:border-green-500 transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/polls/${pollId}`}>
                      <Button 
                        type="button"
                        variant="outline"
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      loading={loading}
                      disabled={!isValidForm || loading}
                      size="lg"
                      icon={Save}
                      className="bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {loading ? 'Updating Poll...' : 'Update Poll'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Edit Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-green-600 dark:text-green-400">{getFormProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-linear-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${getFormProgress()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                  <Badge variant={isValidForm ? "success" : "warning"} className="text-sm">
                    {isValidForm ? "Ready to Update" : "Incomplete"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Editing Tips Card */}
            <Card className="bg-linear-to-br from-green-50 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                  Editing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-3 shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">Changing options with votes may affect existing results</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-3 shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">You cannot delete options that have received votes</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-3 shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">Consider creating a new poll if you want to make major changes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/polls/${pollId}`} className="block">
                  <Button variant="outline" className="w-full justify-start" icon={Eye}>
                    View Poll
                  </Button>
                </Link>
                <Link href="/polls/create" className="block">
                  <Button variant="outline" className="w-full justify-start" icon={Plus}>
                    Create New Poll
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
