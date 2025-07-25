'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/utils/supabase/client"
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
import Bluetooth from "@/components/bluetooth"

export default function Page() {
  const [result, setResult] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: "",
      desc: "",
    },
  })

  const onSubmit = async (values: any) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          name: values.name,
          desc: values.desc,
        },
      ])
      .select()

    if (error) {
      console.error(error)
      setResult(error.message)
    } else {
      console.log(data)
      setResult(JSON.stringify(data))
    }
  }

  return (
    <section className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Item</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: import("react-hook-form").ControllerRenderProps<any, "name"> }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Insert</Button>
        </form>
      </Form>

      {result && (
        <div>
          <Bluetooth />
        </div>
      )}
    </section>
  )
}
