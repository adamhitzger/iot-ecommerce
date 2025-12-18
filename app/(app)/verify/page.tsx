"use client"

import type { ActionResponse } from "@/types"
import { useActionState, useEffect, useRef } from "react"
import { verifyCodeFn } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { motion } from "motion/react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const actionState: ActionResponse<{ code: string }> = {
  success: false,
  message: "",
}

export default function VerificationCodeForm() {
  const [state, action, isPending] = useActionState(verifyCodeFn, actionState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message)
    } else if (state.success) {
      toast.success(state.message)
    }
  }, [state.success, state.message])

  return (
    <motion.form
      ref={formRef}
      initial={{ opacity: 0, y: -500 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -500 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-primary-third p-6 flex flex-col m-auto w-full md:w-1/2 gap-5 justify-items-center content-end"
      autoComplete="off"
    >
      <div className="w-full flex flex-col space-y-4 col-span-2">
        <h1 className="text-2xl font-bold">Ověření kódu</h1>
        <span className="text-white">Zadejte 6 místný kód, který jsme vám poslali na email.</span>
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <InputOTP maxLength={6} name="code">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        {state?.errors?.code && <p className="text-base font-semibold text-red-500">{state.errors.code}</p>}
      </div>

      <div className="flex flex-col col-span-2 items-center justify-end">
        <Button type="submit" formAction={action} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Ověřit"}
        </Button>
      </div>

      <div className="w-full col-span-2 text-center text-sm">
        <p>
          Nedostali jste kód?{" "}
          <Link href="/signin" className="underline decoration-wavy decoration-secondary">
            Odeslat znovu
          </Link>
        </p>
        <p>
          Zpět na{" "}
          <Link href="/signin" className="underline decoration-wavy decoration-secondary">
            přihlášení
          </Link>
        </p>
      </div>
    </motion.form>
  )
}
