import Image from "next/image";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { GroupProp } from "@/types/group";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { CircleX,Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { getAccessToken } from "@/services/AuthService";
import { getCurrentUser } from "@/services/UserService";
enum Dialogs {
  Delete = 1,
  Edit = 2,
}
const GroupImgComponent = (props: GroupProp & { onGroupUpdated: () => Promise<void> }) => {
        const {group_image,group_name,group_owner,group_id,onGroupUpdated } = props;
        const [Groupname, setgroupName] = useState('');
        const [isHovered, setIsHovered] = React.useState(false);
        const [open, setOpen] = useState(false);
        const [dialog, setDialog] = useState(0)

        async function handleDeleteGroup(event: React.FormEvent) {
          const accessToken = await getAccessToken(true);
          event.preventDefault();
          const response = await fetch(`/dashboard/api/groupchat?id=${props.group_id}`, {
            method: "DELETE", 
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
          }
          }
        )
        console.log(response);
        if (response.ok) {
          await props.onGroupUpdated(); 
          setOpen(false);
          }
        }
        async function handleEditGroup(event: React.FormEvent) {
          const accessToken = await getAccessToken(true);
          event.preventDefault();
          const Groupdata = {
            group_id: group_id,
            group_name: Groupname,
            owner_id: group_owner,
            group_img: "/assets/images/profile-pic.jpg"
        };
          const response = await fetch('/dashboard/api/groupchat', {
            method: "PUT", 
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
          },
            body: JSON.stringify(Groupdata),
          }
        )
        console.log(response);
        if (response.ok) {
          await onGroupUpdated(); 
          setOpen(false);
          }
        }
    return(
        <section
        className={cn("h-[70px] bg-dark-10 hover:bg-dark-1 hover:rounded-[8px] p-[10px] ",
      " max-w-[472px] cursor-pointer mb-[2px]", props.className)}
      onClick={props.handleClick}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      >
          <div className="flex flex-col justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
          <ContextMenu>
          <ContextMenuTrigger>
            <Image
              src={props.group_image ? props.group_image : "/assets/images/group-chat-default.png"}
              alt="contact's image"
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full"
            />
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-dark-10 text-gray-4 shadow-2xl w-60 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
            <DialogTrigger asChild className="outline-none"  onClick={() => {setDialog(Dialogs.Delete)}}>
            <ContextMenuItem>
            <CircleX className="mr-2 h-4 w-4" />
            <span>Delete</span>
            </ContextMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild className="outline-none"  onClick={() => {setDialog(Dialogs.Edit)}}>
            <ContextMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
            </ContextMenuItem>
            </DialogTrigger>
            </ContextMenuContent>
            </ContextMenu>
            <DialogContent className="bg-dark-9 text-gray-2 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
            {dialog === Dialogs.Delete ? (
            <>
            <DialogHeader className="flex flex-col space-y-8">
            <DialogTitle>Delete Groupchat</DialogTitle></DialogHeader>
            <DialogDescription className="flex items-center space-x-4">
            <p className="text-gray-2">Are you sure want to delete <span className="font-semibold text-white">{props.group_name}</span> ?</p>
            </DialogDescription>
            <DialogFooter>
            <form onSubmit={(event) => { event.preventDefault(); handleDeleteGroup(event); }}>
            <Button variant="ghost" type="submit">
                            Yes, I am sure
                          </Button>
                          </form>
                        </DialogFooter> 
                        </>)
            : (<>
            <DialogHeader>
            <DialogTitle>Edit Groupchat</DialogTitle>
            <DialogDescription className ="text-white">
              Click Edit when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => { event.preventDefault(); handleEditGroup(event); }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 ">
              <span className="w-20 whitespace-nowrap select-none">
                Group Name
              </span>
              <input
                required id="Groupname"
                defaultValue={props.group_name}
                onChange={(e) => setgroupName(e.target.value)}
                className="col-span-3 bg-dark-6 ring-0 border-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className ="bg-dark-6  select-none">Edit</Button>
          </DialogFooter>
          </form>
           </>) }
            </DialogContent>
            </Dialog>
          </div>
          {isHovered && (
        <div className="absolute left-[80px]  transform -translate-y-full bg-dark-10 text-white px-2 py-1 rounded-md whitespace-nowrap shadow-lg">  
         {group_name}
        </div>
      )}
      </section>
    )
}

export default GroupImgComponent

function fetchCurrentUser() {
  throw new Error("Function not implemented.");
}
