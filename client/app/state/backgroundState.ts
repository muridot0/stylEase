import { signal } from "@preact/signals"
import { BackgroundVariant } from "reactflow"

const backgroundState = signal<BackgroundVariant>(BackgroundVariant.Cross)

export default backgroundState