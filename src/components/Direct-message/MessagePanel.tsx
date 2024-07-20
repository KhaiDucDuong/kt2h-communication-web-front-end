import ContactConversation from "./ContactConversation"
import ContactMessageHeader from "./ContactMessageHeader"

const MessagePanel = () => {
  return (
    <section className="flex flex-col size-full bg-dark-4">
      <div className="h-[98px] w-[full]">
        <ContactMessageHeader />
      <div className="relative flex w-full border-dark-10 border-[1px] "></div>
      </div>
      <div className="pt-[2px] size-full max-h-[calc(100vh-98px)]">
        <ContactConversation />
      </div>
    </section>
  )
}

export default MessagePanel