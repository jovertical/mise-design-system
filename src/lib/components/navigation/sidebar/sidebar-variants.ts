/**
 * Origin: the React package 2.23.0 `sidebar.tsx` (`sidebarMenuButtonVariants`), itself shadcn/ui new-york `sidebar`
 * Diverged: split out of the component file, as badge-variants.ts is. The
 *   `panel` theme drops `font-mono`, which only restated the React package's mono body
 *   face, and its current row is the solid `sidebar-primary` pill the portals
 *   draw, not React's tint and ring.
 */
import { cva, type VariantProps } from 'class-variance-authority'

export const sidebarMenuButtonVariants = cva(
  [
    'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-3 py-6 text-left text-md outline-hidden ring-sidebar-ring transition-[width,height,padding,background-color]',
    'disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    'data-[active=true]:font-medium data-[state=open]:font-medium',
    'group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span:last-child]:hidden [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:[&>svg]:size-5',
    // sidetheme=primary: white text; active/open = white bg, black text. The
    // active row is the same shape as a segmented control's pill — a white
    // surface lifted off a washed track — so it takes the same `shadow-sm`
    // rather than a hand-written double shadow of its own.
    'group-data-[sidetheme=primary]:text-white group-data-[sidetheme=primary]:hover:bg-white/20 group-data-[sidetheme=primary]:active:bg-white/20 group-data-[sidetheme=primary]:focus-visible:ring-white/30',
    'group-data-[sidetheme=primary]:data-[active=true]:bg-white group-data-[sidetheme=primary]:data-[active=true]:text-black group-data-[sidetheme=primary]:data-[active=true]:shadow-sm',
    'group-data-[sidetheme=primary]:data-[state=open]:bg-white group-data-[sidetheme=primary]:data-[state=open]:text-black group-data-[sidetheme=primary]:data-[state=open]:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(0,0,0,0.06)]',
    'group-data-[sidetheme=primary]:data-[state=open]:data-[active=false]:!bg-white/20 group-data-[sidetheme=primary]:data-[state=open]:data-[active=false]:!text-white group-data-[sidetheme=primary]:data-[state=open]:data-[active=false]:!shadow-none',
    // sidetheme=light: foreground text, hover = black/5; active = primary-600 + white text; open-but-not-active = white/20
    'group-data-[sidetheme=light]:text-foreground group-data-[sidetheme=light]:hover:bg-black/5 group-data-[sidetheme=light]:active:bg-white/20 group-data-[sidetheme=light]:data-[active=true]:bg-primary-600 group-data-[sidetheme=light]:data-[active=true]:text-white group-data-[sidetheme=light]:data-[state=open]:bg-white/20 group-data-[sidetheme=light]:data-[active=true]:data-[state=open]:!bg-primary-600 group-data-[sidetheme=light]:focus-visible:ring-border',
    // sidetheme=panel, as the portals draw it: muted resting text, an accent
    // hover, and the current page as a solid pill. An open group that is not
    // the current page keeps the hover surface; the pill belongs to its child.
    'group-data-[sidetheme=panel]:rounded-xl group-data-[sidetheme=panel]:h-8 group-data-[sidetheme=panel]:py-1.5 group-data-[sidetheme=panel]:px-2.5 group-data-[sidetheme=panel]:text-sm group-data-[sidetheme=panel]:text-sidebar-foreground/70 group-data-[sidetheme=panel]:hover:bg-sidebar-accent group-data-[sidetheme=panel]:hover:text-sidebar-foreground group-data-[sidetheme=panel]:focus-visible:ring-sidebar-ring group-data-[sidetheme=panel]:[&>svg]:size-[1.125rem]',
    'group-data-[sidetheme=panel]:data-[active=true]:bg-sidebar-primary group-data-[sidetheme=panel]:data-[active=true]:text-sidebar-primary-foreground group-data-[sidetheme=panel]:data-[active=true]:shadow-none',
    'group-data-[sidetheme=panel]:data-[state=open]:data-[active=false]:bg-sidebar-accent group-data-[sidetheme=panel]:data-[state=open]:data-[active=false]:text-sidebar-foreground',
  ],
  {
    variants: {
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-base group-data-[collapsible=icon]:p-0! [&>svg]:size-5 [&>svg]:shrink-0 group-data-[collapsible=icon]:[&>svg]:size-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export type SidebarMenuButtonSize = NonNullable<
  VariantProps<typeof sidebarMenuButtonVariants>['size']
>
