import { z } from "zod";

export function transformChannelName(name: string) {
  return name
    .toLocaleLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const channelNameSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(50)
    .transform((name, ctx) => {
      const transformed = transformChannelName(name);
      if (transformed.length < 3) {
        ctx.addIssue({
          code: "custom",
          message:
            "Channel name must be at least 3 characters long after formatting.",
        });
      }
      return transformed;
    }),
});

export type channelNameSchemaType = z.infer<typeof channelNameSchema>;
