'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const kpiCards = [
    {
      title: 'Total Users',
      value: '1,240',
      change: '+18%',
      icon: Users,
    },
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+22%',
      icon: TrendingUp,
    },
    {
      title: 'Active Orders',
      value: '156',
      change: '+12',
      icon: ShoppingCart,
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5',
      icon: AlertCircle,
    },
  ]

  const users = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      role: 'customer',
      status: 'Active',
      joinDate: 'Dec 1, 2024',
    },
    {
      id: 2,
      name: 'Aisha Mohammed',
      email: 'aisha@example.com',
      role: 'artisan',
      status: 'Active',
      joinDate: 'Nov 15, 2024',
    },
    {
      id: 3,
      name: 'Mohammed Taye',
      email: 'mohammed@example.com',
      role: 'agent',
      status: 'Active',
      joinDate: 'Nov 1, 2024',
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Ahmed Hassan',
      total: '$149.99',
      status: 'Completed',
      date: 'Dec 15, 2024',
    },
    {
      id: 'ORD-002',
      customer: 'Fatima Ali',
      total: '$89.99',
      status: 'Processing',
      date: 'Dec 14, 2024',
    },
    {
      id: 'ORD-003',
      customer: 'Mohammed Taye',
      total: '$199.99',
      status: 'Shipped',
      date: 'Dec 12, 2024',
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      type: 'Artisan Registration',
      name: 'Bekele Wolde',
      date: 'Dec 16, 2024',
    },
    {
      id: 2,
      type: 'Product Listing',
      name: 'Traditional Coffee Set',
      date: 'Dec 15, 2024',
    },
    {
      id: 3,
      type: 'Artisan Verification',
      name: 'Selam Adeyemi',
      date: 'Dec 14, 2024',
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer':
        return 'bg-primary/20 text-primary'
      case 'artisan':
        return 'bg-secondary/20 text-secondary-foreground'
      case 'agent':
        return 'bg-accent/20 text-accent'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary text-primary-foreground'
      case 'Shipped':
        return 'bg-secondary text-secondary-foreground'
      case 'Processing':
        return 'bg-muted text-muted-foreground'
      case 'Active':
        return 'bg-primary text-primary-foreground'
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage marketplace, users, and content</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiCards.map((card, i) => {
              const Icon = card.icon
              return (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                      <p className="text-2xl font-bold">{card.value}</p>
                      <p className="text-xs text-primary mt-2">{card.change} this month</p>
                    </div>
                    <Icon className="w-8 h-8 text-secondary opacity-20" />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Pending Approvals Tab */}
            <TabsContent value="pending" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>

              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <Badge className="mb-2 bg-accent/20 text-accent">{item.type}</Badge>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-primary">Approve</Button>
                        <Button variant="outline">Reject</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Link href="/admin/users">
                  <Button variant="outline">Manage All</Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-semibold">{user.name}</td>
                        <td className="py-3 px-4 text-sm">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{user.joinDate}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/admin/orders">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-semibold">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4 font-bold text-secondary">{order.total}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{order.date}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Analytics & Reports</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Top Selling Categories</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Textiles</span>
                      <div className="bg-primary/20 px-3 py-1 rounded-full text-sm">45%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Jewelry</span>
                      <div className="bg-secondary/20 px-3 py-1 rounded-full text-sm">30%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Crafts</span>
                      <div className="bg-accent/20 px-3 py-1 rounded-full text-sm">25%</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Platform Statistics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Artisans</span>
                      <span className="font-semibold">324</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Products</span>
                      <span className="font-semibold">2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Customers</span>
                      <span className="font-semibold">8,920</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Revenue</span>
                      <span className="font-semibold">$120,450</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Link href="/admin/reports">
                <Button className="bg-primary hover:bg-primary/90">View Detailed Reports</Button>
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
