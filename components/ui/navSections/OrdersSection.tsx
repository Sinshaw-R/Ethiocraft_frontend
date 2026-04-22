"use client"
import React, { useState } from 'react';
import GenericSection from './GenericSection';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function OrdersSection(props: any) {
  const orders = props.orders || [];
  const loading = props.ordersLoading;
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const rows = (orders || []).map((o: any, idx: number) => {
    const id = o?.id ?? o?._id ?? o?.orderId ?? `unknown-${idx + 1}`;
    const name =
      o?.title ??
      o?.productTitle ??
      o?.product?.title ??
      o?.customer?.name ??
      o?.customerName ??
      'Order not available';
    const owner =
      o?.owner ??
      o?.vendor ??
      (o?.artisan ? `${o.artisan.firstName ?? ''} ${o.artisan.lastName ?? ''}`.trim() : undefined) ??
      o?.artisan?.artisanProfile?.shopName ??
      'Order not available';
    const status = o?.status ?? o?.orderStatus ?? o?.state ?? 'Order not available';
    const updatedRaw =
      o?.updatedAt ?? o?.updated ?? o?.modifiedAt ?? o?.publishedAt ?? o?.createdAt;
    const updated = updatedRaw ? new Date(updatedRaw).toLocaleString() : 'Order not available';
    return { id, name, owner, status, updated };
  });

  const placeholderRows = loading
    ? [{ id: '—', name: 'Loading orders…', owner: '—', status: '—', updated: '—' }]
    : rows.length
    ? rows
    : [{ id: '—', name: 'Order not available', owner: 'Order not available', status: 'Order not available', updated: 'Order not available' }];

  const handleViewDetails = (row: any) => {
    setSelectedOrder(row);
    setIsDrawerOpen(true);
  };

  const handleOpenFullRecord = () => {
    if (selectedOrder?.id) {
      router.push(`/admin/orders/${selectedOrder.id}`);
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      <GenericSection
        title="Orders"
        description={props.sectionDescriptions?.Orders}
        placeholderRows={placeholderRows}
        showFeedback={props.showFeedback}
        setActiveNav={props.setActiveNav}
        onViewDetails={handleViewDetails}
      />

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="fixed bottom-0 right-0 top-0 mt-0 h-full w-full max-w-md rounded-none border-l border-[#e8dece] bg-[#fffdf9]">
          <DrawerHeader className="flex items-center justify-between border-b border-[#e8dece] p-6">
            <DrawerTitle className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
              Order Overview
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6f6258]">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedOrder ? (
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Order ID</p>
                  <p className="mt-1 font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Customer / Reference</p>
                  <p className="mt-1 font-medium">{selectedOrder.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Shop / Artisan</p>
                  <p className="mt-1 font-medium">{selectedOrder.owner}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Status</p>
                  <p className="mt-1 font-medium">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Last Activity</p>
                  <p className="mt-1 font-medium">{selectedOrder.updated}</p>
                </div>
              </div>
            ) : <p className="text-center text-[#85786d]">No order selected.</p>}
          </div>
          <DrawerFooter className="border-t border-[#e8dece] p-6">
            <Button onClick={handleOpenFullRecord} className="w-full bg-[#3E2723] text-white hover:opacity-90">Open Full Record</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
