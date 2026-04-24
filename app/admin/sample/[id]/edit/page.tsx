'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function EditPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ?? 'unknown'
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    id,
    title: '',
    description: '',
    culturalContext: '',
    suggestedPrice: 0,
    materials: '',
    region: '',
    technique: '',
    dimensions: '',
    culturalTags: '',
  })

  useEffect(() => {
    if (id === 'unknown') {
      setLoading(false)
      return
    }

    const fetchSample = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:4000/api/v1/admin/products/samples/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        
        const item = json.data
        if (item) {
          setForm({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            culturalContext: item.culturalMetadata?.culturalSignificance || '',
            suggestedPrice: Number(item.price) || 0,
            materials: item.materials ? item.materials.join(', ') : '',
            region: item.culturalMetadata?.origin || '',
            technique: item.culturalMetadata?.technique || '',
            dimensions: item.dimensions ? `${item.dimensions.width || item.dimensions.widthCm || 0}x${item.dimensions.height || item.dimensions.heightCm || 0}` : '',
            culturalTags: item.tags ? item.tags.join(', ') : '',
          })
        }
      } catch (err) {
        console.error('Failed to fetch sample data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSample()
  }, [id])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const [saving, setSaving] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        title: form.title,
        description: form.description,
        price: form.suggestedPrice.toString(),
        materials: form.materials.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.culturalTags.split(',').map(s => s.trim()).filter(Boolean),
        culturalMetadata: {
          origin: form.region,
          technique: form.technique,
          culturalSignificance: form.culturalContext
        }
      }

      const res = await fetch(`http://localhost:4000/api/v1/artisan/products/samples/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error('Failed to update sample')
      }
      
      router.push(`/admin/sample/${id}`)
    } catch (err) {
      console.error(err)
      alert('Error updating sample. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] text-[#1C1C1C]">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-4 py-6 text-[#1C1C1C] md:px-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.08em] text-[#7c7065]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
            Admin <ChevronRight className="inline h-3 w-3" /> Samples <ChevronRight className="inline h-3 w-3" /> Edit
          </p>
          <h1 className="mt-3 text-3xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
            Edit Sample
          </h1>
          <p className="mt-2 text-sm text-[#6f655d]">Edit product with id: {id}</p>
        </div>

        <form className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm">Title
              <input name="title" value={form.title} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm">Region
              <input name="region" value={form.region} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm md:col-span-2">Description
              <textarea name="description" rows={4} value={form.description} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm md:col-span-2">Cultural story
              <textarea name="culturalContext" rows={4} value={form.culturalContext} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm">Materials
              <input name="materials" value={form.materials} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm">Technique
              <input name="technique" value={form.technique} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm">Dimensions
              <input name="dimensions" value={form.dimensions} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm">Suggested price (ETB)
              <input name="suggestedPrice" type="number" value={String(form.suggestedPrice)} onChange={(e) => onChange(e as any)} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
            <label className="text-sm md:col-span-2">Cultural tags (comma separated)
              <input name="culturalTags" value={form.culturalTags} onChange={onChange} className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[#C6A75E]" />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
            <button type="button" className="rounded-xl border border-neutral-200 px-4 py-2 text-sm" onClick={() => router.push(`/admin/sample/${id}`)}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-xl bg-[#1C1C1C] px-4 py-2 text-sm text-white disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
