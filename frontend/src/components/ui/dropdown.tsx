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
import { Subject, Professor } from "@prisma/client";

type Option = Subject | Professor;

interface DropdownProps {
  options: Option[];
  selectedOptions: Option[];
  setSelectedOptions: (options: any) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  type: "subject" | "professor";
}

const getOptionLabel = (
  option: Option,
  type: "subject" | "professor"
): string => {
  if (type === "subject") {
    return (option as Subject).name;
  } else {
    const prof = option as Professor;
    return `${prof.firstName} ${prof.lastName}`;
  }
};

export function Dropdown(props: DropdownProps) {
  const {
    options,
    selectedOptions,
    setSelectedOptions,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    type,
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleSetValue = (option: Option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between"
        >
          <div className="flex gap-2 justify-start overflow-hidden">
            {selectedOptions?.length ? (
              <>
                {selectedOptions.slice(0, 3).map((val, i) => {
                  const option = options.find((opt) => opt.id === val.id);
                  return option ? (
                    <div
                      key={i}
                      className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium whitespace-nowrap"
                    >
                      {getOptionLabel(option, type)}
                    </div>
                  ) : null;
                })}
                {selectedOptions.length > 3 && (
                  <div className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">
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
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={getOptionLabel(option, type)}
                  onSelect={() => handleSetValue(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOptions.find((opt) => opt.id === option.id)
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
  );
}
