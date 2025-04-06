"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Subject, Course } from "@prisma/client"

type Option = Subject | Course

interface DropdownProps {
  options: Option[]
  selectedOptions: Option[]
  setSelectedOptions: (options: any) => void
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  type: "subject" | "professor" | "course"
}

const getOptionLabel = (
  option: Option,
  type: "subject" | "professor" | "course"
): string => {
  if (type === "subject") {
    return (option as Subject).name
  } else {
    return (option as any).label
  }
}

export function Dropdown(props: DropdownProps) {
  const {
    options,
    selectedOptions,
    setSelectedOptions,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    type
  } = props

  const [open, setOpen] = useState(false)

  const handleSetValue = (option: Option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between bg-[#F0E7D2] hover:bg-[#A99C7E44] border-1 border-[#A99C7E88] rounded-none font-mono"
        >
          <div className="flex gap-2 justify-start overflow-hidden">
            {selectedOptions?.length ? (
              <>
                {selectedOptions.slice(0, 3).map((val, i) => {
                  const option = options.find(
                    (opt) => opt.createdAt === val.createdAt
                  ) // might break something
                  return option ? (
                    <div
                      key={i}
                      className="px-2 py-1 rounded-xl border bg-[#D2CBBC] text-xs font-medium whitespace-nowrap"
                    >
                      {getOptionLabel(option, type)}
                    </div>
                  ) : null
                })}
                {selectedOptions.length > 3 && (
                  <div className="px-2 py-1 rounded-xl border bg-[#D2CBBC] text-xs font-medium">
                    +{selectedOptions.length - 3} more
                  </div>
                )}
              </>
            ) : (
              placeholder
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command className="bg-[#F0E7D2] border-1 border-[#A99C7E88] rounded-none font-mono">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={getOptionLabel(option, type)}
                  onSelect={() => handleSetValue(option)}
                  className="hover:bg-[#A99C7E88] data-[selected=true]:bg-[#A99C7E88]"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOptions.find((opt) => {
                        if (type === "course") {
                          return opt === option
                        } else {
                          opt.createdAt === option.createdAt // might break something
                        }
                      })
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {getOptionLabel(option, type)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
