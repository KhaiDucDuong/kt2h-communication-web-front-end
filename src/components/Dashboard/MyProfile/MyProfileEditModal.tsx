import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserSessionContext } from "@/types/context";
import { Dialog } from "@radix-ui/react-dialog";
import { LoaderCircleIcon } from "lucide-react";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface MyProfileEditModalProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const MyProfileEditModal = (props: MyProfileEditModalProps) => {
  const { show, setShow } = props;
  const userSessionContext = useContext(UserSessionContext);
  const user = userSessionContext?.currentUser;
  const setUser = userSessionContext?.setCurrentUser;

  if (!user || !setUser)
    return (
      <DialogContent className="sm:max-w-[500px] h-[308px] flex justify-center text-gray-2 bg-dark-8 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
        <LoaderCircleIcon className="animate-spin size-[32px] m-auto" />
      </DialogContent>
    );

  const [firstName, setFirstName] = useState<string>(user.first_name);
  const [lastName, setLastName] = useState<string>(user.last_name);
  const [phone, setPhone] = useState<string>(user.phone ? user.phone : "");

  function resetState() {
    if (!user) return;
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone ? user.phone : "");
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      resetState;
      setShow(false);
    }
  }

  function onCancel(e: MouseEvent) {
    resetState;
    setShow(false);
  }

  function onSave(e: MouseEvent) {}

  return (
    <Dialog open={show} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[500px] bg-dark-8 text-gray-2 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="text-gray-2">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 mt-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-left">
              First name
            </label>
            <input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3  bg-dark-6 text-gray-4 outline-none"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-left">
              Last name
            </label>
            <input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3 bg-dark-6 text-gray-4 outline-none"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-left">
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3 bg-dark-6 text-gray-4 outline-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            type="submit"
            className="hover:bg-red-400"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            type="submit"
            className="hover:bg-green-400"
            onClick={onSave}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MyProfileEditModal;
