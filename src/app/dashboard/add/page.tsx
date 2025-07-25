'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import Bluetooth from "@/components/EnergyMeter"

export default function Page() {
  const [sessionInfo, setSessionInfo] = useState<{
    name: string,
    desc: string
  } | null>(null)

  const form = useForm({
    defaultValues: {
      name: "",
      desc: "",
    },
  })

  const onSubmit = (values: any) => {
    setSessionInfo({
      name: values.name,
      desc: values.desc,
    })
  }

  return (
    <section className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Item</h1>

      {!sessionInfo && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Next: Connect BLE</Button>
          </form>
        </Form>
      )}

      {sessionInfo && (
        <Bluetooth name={sessionInfo.name} desc={sessionInfo.desc} />
      )}
    </section>
  )
}
