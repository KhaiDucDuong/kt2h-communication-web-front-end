import { cn } from "@/lib/utils"

interface MoreInfoProps {
  className?: string
}

const MoreInfoPanel = (props: MoreInfoProps) => {
  return (
    <section className={cn("flex flex-col w-[378px] bg-dark-9 ", props.className)}>MoreInfoPanel</section>
  )
}

export default MoreInfoPanel