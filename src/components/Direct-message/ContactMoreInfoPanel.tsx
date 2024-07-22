import { cn } from "@/lib/utils"

interface MoreInfoProps {
  className?: string
}

const ContactMoreInfoPanel = (props: MoreInfoProps) => {
  return (
    <section className={cn("flex flex-col w-[378px] bg-dark-9 ", props.className)}>MoreInfoPanel</section>
  )
}

export default ContactMoreInfoPanel