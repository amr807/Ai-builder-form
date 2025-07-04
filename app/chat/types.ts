export interface Question {
  text: string
  type: "shortAnswer" | "paragraph" | "multipleChoice" | "checkbox" | "dropdown" | "date" | "time"
  options?: string[]
  required?: boolean
}