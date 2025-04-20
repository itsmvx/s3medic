import { Link, router } from "@inertiajs/react";

export const Footer = () => {
    return (
        <>
            <footer className="max-h-20 overflow-hidden flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <div className="text-xs text-gray-500">
                    &copy;2025, Made with&nbsp;
                    <span className="cursor-pointer" onClick={ ()=> router.visit(route('hall-of-fames')) }>&#10084;&#65039;</span>&nbsp;
                    by Who?
                </div>
            </footer>
        </>
    );
};
