Skip to content
Florian 's projects
Florian 's projects

Hobby

common-tongue

cc9spdy5i

Changelog
Help
Docs

Source
Output
src/components/MenuBar.tsx

import "./MenuBar.scss";
import type { Editor } from "@tiptap/react";
import { Fragment, useState, useEffect } from "react";
import MenuItem from "./MenuItem.jsx";
import validator from "validator";

export default function MenuBar({ editor }: { editor: Editor }) {
  // State to force re-render
  const [, setState] = useState(0);

  useEffect(() => {
    // Handler to update state
    const handleUpdate = () => {
      setState((prev) => prev + 1);
    };

    // Subscribe to editor events
    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    // Cleanup subscription on unmount
    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);
  
  const items = [
    {
      icon: "bold",
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
© 2024

All systems normal

Command Menu
⌘
K
Select a display theme:

system

light

dark
Home
Documentation
Guides
Help
Contact Sales
Blog
Changelog
Pricing
Enterprise
common-tongue – Deployment Source – Vercel
