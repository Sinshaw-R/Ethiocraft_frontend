"use client"
import React, { useEffect, useState } from 'react';
import GenericSection from './GenericSection';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function ProductsSection(props: any) {
  const [products, setProducts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, "http://localhost:4000/api/v1");
    const url = `${base}/marketplace/products`;
    let cancelled = false;

    setLoading(true);
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        let items: any[] = [];
        // Expected response shape: { message: string, data: { items: [...], meta: {...} } }
        if (Array.isArray(json?.data?.items)) items = json.data.items;
        else if (Array.isArray(json)) items = json;
        else if (Array.isArray(json?.items)) items = json.items;
        else if (json && typeof json === 'object') {
          // Fallback: gather any array-like values from the response
          items = Object.values(json).flat().filter(Boolean);
        }
        setProducts(items);
      })
      .catch((err) => {
        console.error('Failed to fetch products', err);
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = (products || []).map((p: any, idx: number) => {
    const id = p?.id ?? p?._id ?? `unknown-${idx + 1}`;
    const name = p?.name ?? p?.title ?? 'Product details unavailable';
    const owner = p?.owner ?? p?.vendor ?? 'Product details unavailable';
    const status = p?.status ?? p?.state ?? 'Product details unavailable';
    const updatedRaw = p?.updatedAt ?? p?.updated ?? p?.lastUpdated ?? p?.modifiedAt;
    const updated = updatedRaw ? new Date(updatedRaw).toLocaleString() : 'Product details unavailable';
    return { id, name, owner, status, updated };
  });

  const placeholderRows = loading
    ? [{ id: '—', name: 'Loading products…', owner: '—', status: '—', updated: '—' }]
    : rows.length
    ? rows
    : [{ id: '—', name: 'Product details unavailable', owner: 'Product details unavailable', status: 'Product details unavailable', updated: 'Product details unavailable' }];

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const handleViewDetails = (productRow: any) => {
    setSelectedProduct(productRow);
    setIsDrawerOpen(true);
  };

  const handleOpenFullRecord = () => {
    if (selectedProduct?.id) {
      router.push(`/admin/products/${selectedProduct.id}`);
      setIsDrawerOpen(false); // Close drawer after navigation
    }
  };

  return (
    <>
      <GenericSection
        title="Products"
        description={props.sectionDescriptions?.Products}
        placeholderRows={placeholderRows}
        loading={loading}
        showFeedback={props.showFeedback}
        setActiveNav={props.setActiveNav}
        onViewDetails={handleViewDetails}
      />

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="fixed bottom-0 right-0 top-0 mt-0 h-full w-full max-w-md rounded-none">
          <DrawerHeader className="flex items-center justify-between border-b border-[#e8dece] p-6">
            <DrawerTitle className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
              Product Details
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6f6258]">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedProduct ? (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Product ID</p>
                  <p className="mt-1 font-medium">{selectedProduct.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Name</p>
                  <p className="mt-1 font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Owner</p>
                  <p className="mt-1 font-medium">{selectedProduct.owner}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Status</p>
                  <p className="mt-1 font-medium">{selectedProduct.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Last Updated</p>
                  <p className="mt-1 font-medium">{selectedProduct.updated}</p>
                </div>
              </div>
            ) : <p>No product selected.</p>}
          </div>
          <DrawerFooter className="border-t border-[#e8dece] p-6">
            <Button onClick={handleOpenFullRecord} className="w-full">Open Full Record</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
