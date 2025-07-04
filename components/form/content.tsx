"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Question } from "../../app/chat/types"
type PageProps = {
  questions: Question[]
}

export default function ModernForm({ questions }: PageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[] | undefined>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [direction, setDirection] = useState(0)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1)
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const canProceed = () => {
    const question = questions[currentQuestion]
    const answer = answers[currentQuestion]

    if (!question.required) return true
    if (!answer) return false

    if (question.type === "checkbox") {
      return Array.isArray(answer) && answer.length > 0
    }

    return answer !== "" && answer !== undefined
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  const renderQuestion = (question: Question) => {
    const answer = answers[currentQuestion]

    switch (question.type) {
      case "shortAnswer":
        return (
          <Input
            placeholder="Type your answer here..."
            value={answer || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="text-base p-4 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 bg-white rounded-lg"
          />
        )

      case "paragraph":
        return (
          <Textarea
            placeholder="Please provide your detailed response..."
            value={answer || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="text-base p-4 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 min-h-[120px] bg-white rounded-lg resize-none"
          />
        )

      case "multipleChoice":
        return (
          <RadioGroup value={typeof answer === "string" ? answer : ""} onValueChange={handleAnswer} className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                onClick={() => handleAnswer(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="border-2 border-gray-300 group-hover:border-blue-500"
                />
                <Label
                  htmlFor={option}
                  className="text-base cursor-pointer flex-1 text-gray-700 group-hover:text-gray-900"
                >
                  {option}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
              >
                <Checkbox
                  id={option}
                  checked={(answer || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = Array.isArray(answer) ? answer : []
                    if (checked) {
                      handleAnswer([...currentAnswers, option])
                    } else {
                      handleAnswer(currentAnswers.filter((a: string) => a !== option))
                    }
                  }}
                  className="border-2 border-gray-300 group-hover:border-blue-500"
                />
                <Label
                  htmlFor={option}
                  className="text-base cursor-pointer flex-1 text-gray-700 group-hover:text-gray-900"
                >
                  {option}
                </Label>
              </motion.div>
            ))}
          </div>
        )

      case "dropdown":
        return (
          <Select
            value={typeof answer === "string" ? answer : ""}
            onValueChange={handleAnswer}
          >
            <SelectTrigger className="text-base p-4 border-2 border-gray-200 focus:border-blue-500 bg-white rounded-lg">
              <SelectValue placeholder="Please select an option" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              {question.options?.map((option) => (
                <SelectItem key={option} value={option} className="text-base hover:bg-blue-50 focus:bg-blue-50">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "date":
        return (
          <Input
            type="date"
            value={answer || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="text-base p-4 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 bg-white rounded-lg"
          />
        )

      case "time":
        return (
          <Input
            type="time"
            value={answer || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="text-base p-4 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 bg-white rounded-lg"
          />
        )

      default:
        return null
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-lg text-center shadow-xl border-0">
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your responses have been successfully submitted. We appreciate your time and feedback.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Question Card */}
      <Card className="mb-8 shadow-lg border-0 bg-white">
        <CardContent className="p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-start space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">{currentQuestion + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                      {questions[currentQuestion].text}
                    </h2>
                    {questions[currentQuestion].required && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <span className="mr-1">*</span>
                        Required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>{renderQuestion(questions[currentQuestion])}</div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 rounded-lg bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={nextQuestion}
          disabled={!canProceed()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 disabled:opacity-50 rounded-lg font-medium transition-colors duration-200"
        >
          <span>{currentQuestion === questions.length - 1 ? "Submit" : "Next"}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
