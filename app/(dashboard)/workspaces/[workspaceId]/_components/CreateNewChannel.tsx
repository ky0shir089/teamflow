"use client";

import {
  channelNameSchema,
  channelNameSchemaType,
  transformChannelName,
} from "@/app/schemas/channels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateNewChannel = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter()
  const {workspaceId} = useParams<{workspaceId: string}>()

  const form = useForm<channelNameSchemaType>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      onSuccess: (newChannel) => {
        toast.success(`Channel ${newChannel.name} created successfully`);
        queryClient.invalidateQueries(orpc.channel.list.queryOptions());
        form.reset();
        setOpen(false);
        router.push(`/workspaces/${workspaceId}/channel/${newChannel.id}`)
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === "RATE_LIMITED") {
            return toast.error(error.message);
          }

          return toast.error(error.message);
        }

        toast.error("Failed to create channel. Please try again!");
      },
    })
  );

  function onSubmit(values: channelNameSchemaType) {
    createChannelMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus size={4} /> Add Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Channel" {...field} />
                  </FormControl>
                  {transformedName && transformedName !== watchedName && (
                    <p className="text-sm text-muted-foreground">
                      Will be created as:{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {transformedName}
                      </code>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createChannelMutation.isPending}>
              {createChannelMutation.isPending
                ? "Creating..."
                : "Create Channel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewChannel;
