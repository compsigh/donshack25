"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DropdownProps {
  options: { value: string; label: string }[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  value: string[];
  setValue: (value: string[]) => void;
  onChange: (value: string[]) => void;
}

export function Dropdown(props: DropdownProps) {
  const {
    options,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    value,
    setValue,
    onChange,
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      value.splice(value.indexOf(val), 1);
      setValue(value.filter((item) => item !== val));
    } else {
      setValue([...value, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[480px] justify-between"
        >
          <div className="flex gap-2 justify-start">
            {value?.length
              ? value.map((val, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                  >
                    {
                      options.find((option) => option.value === val)
                        ?.label
                    }
                  </div>
                ))
              : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandList>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSetValue(option.value);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
