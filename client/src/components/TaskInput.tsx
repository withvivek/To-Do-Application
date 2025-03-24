import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, addTask } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusIcon, CloudSun, Tag, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function TaskInput() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  
  // Priority badge colors
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-rose-100 text-rose-800 border-rose-200",
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (user?.id) {
      try {
        // Format the date as ISO string to be compatible with the API
        const taskData = {
          userId: user.id,
          title,
          description: description || "",
          priority,
          isOutdoor,
          // If dueDate exists, convert it to ISO string
          dueDate: dueDate ? dueDate.toISOString() : null,
        };
        
        const result = await dispatch(addTask(taskData)).unwrap();
        
        // Reset form fields
        setTitle('');
        setDescription('');
        setPriority('medium');
        setIsOutdoor(false);
        setDueDate(undefined);
        
        toast({
          title: "Success",
          description: "Task added successfully",
        });
      } catch (error) {
        console.error("Error adding task:", error);
        toast({
          title: "Error",
          description: typeof error === 'string' ? error : "Failed to add task",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "User authentication required",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="task-container"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center shadow-md">
          <PlusIcon className="h-5 w-5 text-white" />
        </div>
        <h2 className="gradient-text text-2xl">Create New Task</h2>
      </div>
      
      <Separator className="mb-6" />
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="task-title" className="text-sm font-medium text-gray-700">
            Task Title <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to accomplish?"
            required
            className="input-glass text-lg py-6"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-gray-500" />
            <Label htmlFor="task-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
          </div>
          <Textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add additional details about this task..."
            rows={3}
            className="input-glass resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <Label htmlFor="task-priority" className="text-sm font-medium text-gray-700">
                Priority
              </Label>
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="task-priority" className="input-glass">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full bg-green-500`}></span>
                  <span>Low Priority</span>
                </SelectItem>
                <SelectItem value="medium" className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full bg-amber-500`}></span>
                  <span>Medium Priority</span>
                </SelectItem>
                <SelectItem value="high" className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full bg-rose-500`}></span>
                  <span>High Priority</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <Label htmlFor="due-date" className="text-sm font-medium text-gray-700">
                Due Date
              </Label>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal input-glass",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Select a deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex items-center py-2">
          <div className="flex items-center space-x-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
            <Checkbox 
              id="task-outdoor" 
              checked={isOutdoor}
              onCheckedChange={(checked) => setIsOutdoor(checked === true)}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <div>
              <Label htmlFor="task-outdoor" className="font-medium text-blue-800 flex items-center gap-2">
                <CloudSun className="h-4 w-4" />
                Outdoor Activity
              </Label>
              <p className="text-xs text-blue-600 mt-1">Mark if weather conditions are important for this task</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="button-gradient w-full py-6 text-lg rounded-xl"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Task
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
