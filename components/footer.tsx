import { Hexagon } from "lucide-react";

/**
 * The agency credit every site carries (prompts/definition-of-done.md): "Made by Hexaigon" with the
 * Hexagon icon in the primary colour, linking to https://hexaigon.gr. Always .gr, never .com.
 */
const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <a
          href="https://hexaigon.gr"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex cursor-pointer items-center gap-1.5"
        >
          <Hexagon className="size-4 text-primary" />
          Made by
          <span className="font-medium text-foreground transition-colors group-hover:text-primary">Hexaigon</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
