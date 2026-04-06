'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingBag, Package, Heart, Settings } from 'lucide-react'
import Link from 'next/link'

export default function CustomerDashboard() {
  const recentOrders = [
    {
      id: 'ORD-001',
      date: 'Dec 15, 2024',
      total: '$149.99',
      status: 'Delivered',
      items: 'Traditional Habesha Dress',
    },
    {
      id: 'ORD-002',
      date: 'Dec 10, 2024',
      total: '$89.99',
      status: 'Processing',
      items: 'Hand-Woven Basket',
    },
    {
      id: 'ORD-003',
      date: 'Dec 5, 2024',
      total: '$199.99',
      status: 'Shipped',
      items: 'Gold Filigree Jewelry',
    },
  ]

  const wishlistItems = [
    {
      id: 1,
      name: 'Leather Shoulder Bag',
      price: '$129.99',
      image: '/placeholder.svg?height=200&width=200',
      artisan: 'Crafts by Aisha',
    },
    {
      id: 2,
      name: 'Coffee Ceremony Set',
      price: '$79.99',
      image: '/placeholder.svg?height=200&width=200',
      artisan: 'Ethiopian Heritage Co.',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Customer!</h1>
            <p className="text-muted-foreground">Manage your orders, wishlist, and account settings</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-2xl font-bold">Active</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Orders</h2>
                <Link href="/customer/orders">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="font-semibold">{order.items}</p>
                        <p className="text-sm text-muted-foreground">Order {order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-bold text-lg">{order.total}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Link href={`/customer/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex gap-4 p-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.artisan}</p>
                        <p className="text-lg font-bold text-secondary mt-2">{item.price}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1 bg-primary">
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">First Name</label>
                    <p className="text-lg">John</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Last Name</label>
                    <p className="text-lg">Doe</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-muted-foreground">Email</label>
                    <p className="text-lg">john.doe@example.com</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button className="bg-primary hover:bg-primary/90">Edit Profile</Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold">Addresses</h3>
                <div className="space-y-3">
                  <Card className="p-4 bg-muted/50">
                    <p className="font-semibold">Default Shipping Address</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      123 Main St, Addis Ababa, Ethiopia 1000
                    </p>
                  </Card>
                </div>
                <Button variant="outline">Manage Addresses</Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
