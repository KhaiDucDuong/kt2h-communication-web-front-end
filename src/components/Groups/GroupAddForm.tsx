import { Button } from "@/components/ui/button"
import React, { useState } from 'react';
import { getCurrentUser } from "@/services/UserService";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react';
interface GroupAddFormProps {
  onGroupAdded: () => Promise<void>; // Function that will be called after a group is added
}

export function GroupAddForm({onGroupAdded}:GroupAddFormProps) {
  const [Groupname, setgroupName] = useState('');
  const [open, setOpen] = useState(false);

  let ignore = false;

  async function fetchCurrentUser() {
    const data = await getCurrentUser();
    if (data && !ignore) {
      console.log("Set current user data");
    }
    return data;
  }
  async function handleCreateGroup(event: React.FormEvent) {
      event.preventDefault();
      const  user = await fetchCurrentUser();
      const Groupdata = {
        group_name: Groupname,
        owner_id: user?.user_id,
        group_img: "/assets/images/profile-pic.jpg"
    };
      const response = await fetch('/dashboard/api/groupchat', {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify(Groupdata),
      }
    )
    console.log(response);
    if (response.ok) {
      await onGroupAdded(); 
      setOpen(false);
      }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <button 
        className="w-12 h-12 rounded-full bg-dark-9 text-white flex justify-center items-center shadow-lg hover:bg-green-600">
        <span className="pointer-events-none select-none" aria-hidden="true"><Plus size={20}/></span>
      </button>
            </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-dark-9 text-white ring-0 border-0 select-none">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription className ="text-white">
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateGroup}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 ">
            <span className="w-20 whitespace-nowrap select-none">
              Group Name
            </span>
            <input
              required id="Groupname"
              onChange={(e) => setgroupName(e.target.value)}
              className="col-span-3 bg-dark-6 ring-0 border-0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className ="bg-dark-6  select-none">Create group</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default GroupAddForm
