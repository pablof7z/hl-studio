export type Subscriber = {
  id: string
  name?: string
  email?: string
  npub?: string
  tier: "free" | "paid"
  joinedAt: string
}

export const mockSubscribers: Subscriber[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    tier: "paid",
    joinedAt: "May 1, 2023",
  },
  {
    id: "2",
    name: "Sam Taylor",
    email: "sam@example.com",
    npub: "npub1abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrst",
    tier: "paid",
    joinedAt: "May 3, 2023",
  },
  {
    id: "3",
    name: "Jordan Lee",
    npub: "npub1qwertyuiopasdfghjklzxcvbnm0123456789qwertyuiopasdfghjklz",
    tier: "free",
    joinedAt: "May 5, 2023",
  },
  {
    id: "4",
    name: "Casey Kim",
    email: "casey@example.com",
    tier: "free",
    joinedAt: "May 7, 2023",
  },
  {
    id: "5",
    name: "Riley Smith",
    email: "riley@example.com",
    npub: "npub1poiuytrewqlkjhgfdsamnbvcxzpoiuytrewqlkjhgfdsamnbvcxzpoi",
    tier: "paid",
    joinedAt: "May 10, 2023",
  },
  {
    id: "6",
    name: "Taylor Wilson",
    npub: "npub1mnbvcxzlkjhgfdsapoiuytrewqmnbvcxzlkjhgfdsapoiuytrewqmn",
    tier: "free",
    joinedAt: "May 12, 2023",
  },
  {
    id: "7",
    name: "Morgan Davis",
    email: "morgan@example.com",
    tier: "free",
    joinedAt: "May 15, 2023",
  },
  {
    id: "8",
    name: "Jamie Rodriguez",
    email: "jamie@example.com",
    npub: "npub1asdfghjklqwertyuiopzxcvbnmasdfghjklqwertyuiopzxcvbnmasd",
    tier: "paid",
    joinedAt: "May 18, 2023",
  },
  {
    id: "9",
    name: "Quinn Martinez",
    email: "quinn@example.com",
    tier: "free",
    joinedAt: "May 20, 2023",
  },
  {
    id: "10",
    name: "Avery Thompson",
    npub: "npub1zxcvbnmasdfghjklqwertyuiopzxcvbnmasdfghjklqwertyuiopzx",
    tier: "paid",
    joinedAt: "May 22, 2023",
  },
]
