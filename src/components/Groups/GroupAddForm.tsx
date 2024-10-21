import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export function GroupAddForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <button 
        className="w-12 h-12 rounded-full bg-blue-500 text-white flex justify-center items-center shadow-lg hover:bg-blue-600">
        <span className="pointer-events-none select-none" aria-hidden="true">+</span>
      </button>
            </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark-9 text-white">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription className ="text-white">
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right">
              Group Name
            </span>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3 bg-dark-6"
            />
          </div>

        </div>
        <DialogFooter>
          <Button type="submit" className ="bg-dark-6">Create group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GroupAddForm
