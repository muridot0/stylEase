import { signal } from "@preact/signals"
import { BackgroundVariant } from "reactflow"

const backgroundState = signal<BackgroundVariant>(BackgroundVariant.Dots)

export default backgroundState