import 'dotenv/config'
import connectDB from './mongoose'
import { Game } from './models/Game'
import { Click } from './models/Click'

async function main() {
    await connectDB()

    // Clear existing data
    await Click.deleteMany()
    await Game.deleteMany()

    // Create sample games
    const games = [
        {
            name: 'RummyCircle',
            description: 'India\'s largest rummy platform with millions of players',
            bonus: '₹2000 Welcome Bonus',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800&h=600&fit=crop',
            affiliateUrl: 'https://example.com/rummycircle',
            features: [
                'Instant withdrawals',
                '24/7 customer support',
                'Secure & certified platform',
                'Multiple game variants'
            ]
        },
        {
            name: 'Junglee Rummy',
            description: 'Premium rummy experience with exciting tournaments',
            bonus: '₹5250 Bonus',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop',
            affiliateUrl: 'https://example.com/jungleerummy',
            features: [
                'Daily tournaments',
                'Fast cash withdrawals',
                'Practice games available',
                'Mobile app support'
            ]
        },
        {
            name: 'Ace2Three',
            description: 'Play rummy online with real cash prizes',
            bonus: '₹1500 Sign Up Bonus',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800&h=600&fit=crop',
            affiliateUrl: 'https://example.com/ace2three',
            features: [
                'RNG certified',
                'Quick registration',
                'Multiple payment options',
                'Loyalty rewards program'
            ]
        },
        {
            name: 'KhelPlay Rummy',
            description: 'Trusted platform for online rummy enthusiasts',
            bonus: '₹2500 Welcome Offer',
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
            affiliateUrl: 'https://example.com/khelplay',
            features: [
                'Safe & secure',
                'Live chat support',
                'Weekly promotions',
                'Refer & earn program'
            ]
        },
        {
            name: 'Classic Rummy',
            description: 'Experience classic rummy with modern features',
            bonus: '₹3000 Bonus',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=800&h=600&fit=crop',
            affiliateUrl: 'https://example.com/classicrummy',
            features: [
                'User-friendly interface',
                'Instant deposits',
                'Tournament leaderboards',
                'VIP club benefits'
            ]
        },
        {
            name: 'RummyBaazi',
            description: 'Play rummy and win real cash daily',
            bonus: '₹4000 Welcome Bonus',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
            affiliateUrl: 'https://example.com/rummybaazi',
            features: [
                'Daily cashback offers',
                'Secure transactions',
                'Multi-table gaming',
                'Practice mode available'
            ]
        }
    ]

    await Game.insertMany(games)

    console.log('✅ Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(() => {
        process.exit(0)
    })
