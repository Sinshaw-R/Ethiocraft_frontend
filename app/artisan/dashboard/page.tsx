'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Package, ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'

export default function ArtisanDashboard() {
  const summaryCards = [
    {
      title: 'Total Sales',
      value: '$5,420.50',
      change: '+12.5%',
      icon: TrendingUp,
    },
    {
      title: 'Active Listings',
      value: '24',
      change: '+3',
      icon: Package,
    },
    {
      title: 'Orders This Month',
      value: '18',
      change: '+5',
      icon: ShoppingCart,
    },
    {
      title: 'Average Rating',
      value: '4.8/5',
      change: '+0.2',
      icon: Star,
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Ahmed Hassan',
      product: 'Traditional Habesha Dress',
      date: 'Dec 15, 2024',
      amount: '$149.99',
      status: 'Completed',
    },
    {
      id: 'ORD-002',
      customer: 'Fatima Ali',
      product: 'Hand-Woven Basket',
      date: 'Dec 14, 2024',
      amount: '$89.99',
      status: 'Shipped',
    },
    {
      id: 'ORD-003',
      customer: 'Mohammed Taye',
      product: 'Gold Filigree Jewelry',
      date: 'Dec 12, 2024',
      amount: '$199.99',
      status: 'Processing',
    },
  ]

  const products = [
    {
      id: 1,
      name: 'Traditional Habesha Dress',
      price: '$149.99',
      stock: 5,
      sales: 24,
      image: '/placeholder.svg?height=150&width=150',
    },
    {
      id: 2,
      name: 'Hand-Woven Basket',
      price: '$89.99',
      stock: 12,
      sales: 18,
      image: '/placeholder.svg?height=150&width=150',
    },
    {
      id: 3,
      name: 'Gold Filigree Jewelry',
      price: '$199.99',
      stock: 3,
      sales: 12,
      image: '/placeholder.svg?height=150&width=150',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary text-primary-foreground'
      case 'Shipped':
        return 'bg-secondary text-secondary-foreground'
      case 'Processing':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-border text-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-druk-medium text-3xl md:text-4xl uppercase tracking-[0.04em] mb-2">Artisan Dashboard</h1>
            <p className="font-inter text-muted-foreground">Manage your shop, products, and orders</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryCards.map((card, i) => {
              const Icon = card.icon
              return (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-aeonik text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">{card.title}</p>
                      <p className="font-druk-medium text-2xl">{card.value}</p>
                      <p className="font-inter text-xs text-primary mt-2">{card.change} from last month</p>
                    </div>
                    <Icon className="w-8 h-8 text-secondary opacity-20" />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders" className="font-aeonik text-xs uppercase tracking-[0.12em]">Recent Orders</TabsTrigger>
              <TabsTrigger value="products" className="font-aeonik text-xs uppercase tracking-[0.12em]">My Products</TabsTrigger>
              <TabsTrigger value="settings" className="font-aeonik text-xs uppercase tracking-[0.12em]">Shop Settings</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-aeonik text-lg uppercase tracking-[0.12em] font-bold">Recent Orders</h2>
                <Link href="/artisan/orders">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Order ID</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Customer</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Product</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Amount</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Status</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-semibold">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4 text-sm">{order.product}</td>
                        <td className="py-3 px-4 font-bold text-secondary">{order.amount}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/artisan/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-aeonik text-lg uppercase tracking-[0.12em] font-bold">My Products</h2>
                <Link href="/artisan/products/add">
                  <Button className="bg-primary">Add New Product</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover bg-muted"
                    />
                    <div className="p-4">
                      <h3 className="font-inter font-semibold mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-druk-medium text-lg text-secondary">{product.price}</span>
                        <Badge variant="outline" className="font-aeonik text-xs uppercase tracking-[0.1em]">Stock: {product.stock}</Badge>
                      </div>
                      <p className="font-inter text-sm text-muted-foreground mb-3">{product.sales} sales</p>
                      <div className="flex gap-2">
                        <Link href={`/artisan/products/${product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <h2 className="font-aeonik text-lg uppercase tracking-[0.12em] font-bold mb-4">Shop Settings</h2>

              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="font-aeonik text-xs uppercase tracking-[0.12em] font-bold mb-4">Shop Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="font-aeonik text-xs uppercase tracking-[0.12em] text-muted-foreground">Shop Name</label>
                      <p className="font-inter text-lg">Crafts by Aisha</p>
                    </div>
                    <div>
                      <label className="font-aeonik text-xs uppercase tracking-[0.12em] text-muted-foreground">Description</label>
                      <p className="font-inter text-lg">Traditional Ethiopian handcrafts and textiles</p>
                    </div>
                  </div>
                  <Button className="font-aeonik bg-primary hover:bg-primary/90 mt-4">Edit Shop</Button>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-aeonik text-xs uppercase tracking-[0.12em] font-bold mb-4">Bank Information</h3>
                  <p className="font-inter text-sm text-muted-foreground mb-4">Manage your payment settings</p>
                  <Button variant="outline" className="font-aeonik">Update Payment Method</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .font-druk-medium { font-family: var(--font-druk-medium), sans-serif; }
        .font-aeonik      { font-family: var(--font-aeonik), sans-serif; }
        .font-inter       { font-family: var(--font-inter), sans-serif; }
      `}</style>
    </div>
  )
}
