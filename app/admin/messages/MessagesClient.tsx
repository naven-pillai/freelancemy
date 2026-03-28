"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { relativeTime, formatDate } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 10;

export default function MessagesClient({
  messages,
}: {
  messages: Message[];
}) {
  const [selected, setSelected] = useState<Message | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(messages.length / ITEMS_PER_PAGE));
  const paginated = messages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          View messages from your contact form
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No messages yet
            </p>
            <p className="text-xs text-gray-400">
              Messages from your contact form will appear here
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  <TableHead className="">
                    From
                  </TableHead>
                  <TableHead className=" hidden sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="">
                    Message
                  </TableHead>
                  <TableHead className=" hidden md:table-cell">
                    When
                  </TableHead>
                  <TableHead className=" text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(msg)}
                  >
                    <TableCell className="">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-semibold text-blue-600">
                            {msg.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm whitespace-nowrap">
                          {msg.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className=" hidden sm:table-cell text-xs text-gray-500">
                      {msg.email}
                    </TableCell>
                    <TableCell className=" max-w-xs text-sm text-gray-600">
                      <span className="line-clamp-2">{msg.message}</span>
                    </TableCell>
                    <TableCell className=" hidden md:table-cell text-xs text-gray-400 whitespace-nowrap">
                      {relativeTime(msg.created_at)}
                    </TableCell>
                    <TableCell className=" text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(msg);
                        }}
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-emerald-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-xs text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent onClose={() => setSelected(null)}>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.email}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {selected?.message}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {formatDate(selected?.created_at)}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
