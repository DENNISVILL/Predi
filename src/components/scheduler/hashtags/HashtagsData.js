/**
 * Hashtags Trending Data
 * Sistema de hashtags trending en tiempo real
 */

export const TRENDING_HASHTAGS_DATA = {
    global: {
        hot: [
            { tag: '#AITrend', growth: '+340%', uses: '2.1M', platforms: ['tiktok', 'instagram'] },
            { tag: '#ViralChallenge', growth: '+287%', uses: '1.8M', platforms: ['tiktok'] },
            { tag: '#ContentCreator', growth: '+234%', uses: '3.2M', platforms: ['instagram', 'youtube'] },
            { tag: '#TrendingNow', growth: '+198%', uses: '1.5M', platforms: ['tiktok', 'instagram'] },
            { tag: '#DigitalMarketing', growth: '+167%', uses: '890K', platforms: ['instagram', 'youtube'] }
        ],
        rising: [
            { tag: '#FutureOfContent', growth: '+89%', uses: '456K', platforms: ['youtube'] },
            { tag: '#CreatorEconomy', growth: '+76%', uses: '234K', platforms: ['instagram'] },
            { tag: '#SocialMediaTips', growth: '+65%', uses: '567K', platforms: ['tiktok', 'instagram'] }
        ]
    },
    byCountry: {
        ecuador: [
            { tag: '#EcuadorContent', growth: '+234%', uses: '89K', platforms: ['tiktok', 'instagram'] },
            { tag: '#QuitoVibes', growth: '+189%', uses: '56K', platforms: ['instagram'] },
            { tag: '#EcuadorianCreator', growth: '+156%', uses: '34K', platforms: ['tiktok'] },
            { tag: '#MitadDelMundo', growth: '+134%', uses: '67K', platforms: ['instagram', 'youtube'] }
        ],
        colombia: [
            { tag: '#ColombiaContent', growth: '+267%', uses: '156K', platforms: ['tiktok', 'instagram'] },
            { tag: '#BogotaVibes', growth: '+198%', uses: '89K', platforms: ['instagram'] },
            { tag: '#CreadorColombiano', growth: '+167%', uses: '78K', platforms: ['tiktok'] }
        ],
        mexico: [
            { tag: '#MexicoContent', growth: '+298%', uses: '234K', platforms: ['tiktok', 'instagram'] },
            { tag: '#CDMXVibes', growth: '+234%', uses: '123K', platforms: ['instagram'] },
            { tag: '#CreadorMexicano', growth: '+189%', uses: '145K', platforms: ['tiktok'] }
        ]
    },
    byNiche: {
        food: [
            { tag: '#FoodieLife', growth: '+234%', uses: '1.2M', platforms: ['instagram', 'tiktok'] },
            { tag: '#RecipeOfTheDay', growth: '+189%', uses: '890K', platforms: ['instagram'] },
            { tag: '#FoodHacks', growth: '+167%', uses: '567K', platforms: ['tiktok'] },
            { tag: '#HealthyEating', growth: '+145%', uses: '1.1M', platforms: ['instagram', 'youtube'] },
            { tag: '#CookingTips', growth: '+123%', uses: '456K', platforms: ['youtube', 'instagram'] }
        ],
        fitness: [
            { tag: '#FitnessMotivation', growth: '+267%', uses: '1.8M', platforms: ['tiktok', 'instagram'] },
            { tag: '#WorkoutChallenge', growth: '+234%', uses: '1.3M', platforms: ['tiktok'] },
            { tag: '#FitnessJourney', growth: '+198%', uses: '1.1M', platforms: ['instagram'] },
            { tag: '#HealthyLifestyle', growth: '+167%', uses: '890K', platforms: ['instagram', 'youtube'] },
            { tag: '#GymLife', growth: '+145%', uses: '678K', platforms: ['tiktok', 'instagram'] }
        ],
        fashion: [
            { tag: '#OOTD', growth: '+198%', uses: '2.1M', platforms: ['instagram', 'tiktok'] },
            { tag: '#StyleInspo', growth: '+167%', uses: '1.5M', platforms: ['instagram'] },
            { tag: '#FashionTrends', growth: '+145%', uses: '1.2M', platforms: ['tiktok', 'instagram'] },
            { tag: '#OutfitTransition', growth: '+234%', uses: '890K', platforms: ['tiktok'] },
            { tag: '#FashionHaul', growth: '+123%', uses: '567K', platforms: ['youtube', 'instagram'] }
        ],
        tech: [
            { tag: '#TechTips', growth: '+189%', uses: '678K', platforms: ['youtube', 'instagram'] },
            { tag: '#AITools', growth: '+267%', uses: '456K', platforms: ['tiktok', 'instagram'] },
            { tag: '#TechReview', growth: '+145%', uses: '789K', platforms: ['youtube'] },
            { tag: '#DigitalTrends', growth: '+123%', uses: '345K', platforms: ['instagram', 'youtube'] },
            { tag: '#TechHacks', growth: '+167%', uses: '234K', platforms: ['tiktok'] }
        ]
    },
    byPlatform: {
        tiktok: [
            { tag: '#TikTokMadeMe', growth: '+345%', uses: '3.4M', viral_potential: 95 },
            { tag: '#ForYouPage', growth: '+234%', uses: '2.8M', viral_potential: 92 },
            { tag: '#TikTokChallenge', growth: '+198%', uses: '2.1M', viral_potential: 89 },
            { tag: '#ViralDance', growth: '+167%', uses: '1.9M', viral_potential: 87 },
            { tag: '#TikTokTrend', growth: '+145%', uses: '1.6M', viral_potential: 85 }
        ],
        instagram: [
            { tag: '#InstagramReels', growth: '+234%', uses: '2.3M', viral_potential: 88 },
            { tag: '#IGTrending', growth: '+198%', uses: '1.8M', viral_potential: 85 },
            { tag: '#ReelsInstagram', growth: '+167%', uses: '1.5M', viral_potential: 83 },
            { tag: '#InstagramTips', growth: '+145%', uses: '1.2M', viral_potential: 80 },
            { tag: '#IGInfluencer', growth: '+123%', uses: '890K', viral_potential: 78 }
        ],
        youtube: [
            { tag: '#YouTubeShorts', growth: '+189%', uses: '1.1M', viral_potential: 82 },
            { tag: '#YouTubeTrending', growth: '+156%', uses: '890K', viral_potential: 79 },
            { tag: '#YouTubeCreator', growth: '+134%', uses: '678K', viral_potential: 76 },
            { tag: '#ShortsVideo', growth: '+123%', uses: '567K', viral_potential: 74 },
            { tag: '#YouTubeTips', growth: '+112%', uses: '456K', viral_potential: 72 }
        ]
    }
};

/**
 * Genera hashtags inteligentes
 * @param {string} niche - Nicho
 * @param {string} platform - Plataforma
 * @param {string} country - País
 * @returns {Array} Hashtags recomendados
 */
export const generateSmartHashtags = (niche, platform, country = 'global') => {
    const suggestions = [];

    // Hashtags trending globales
    const globalTrending = TRENDING_HASHTAGS_DATA.global.hot.slice(0, 3);
    suggestions.push(...globalTrending);

    // Hashtags por nicho
    const nicheHashtags = TRENDING_HASHTAGS_DATA.byNiche[niche]?.slice(0, 4) || [];
    suggestions.push(...nicheHashtags);

    // Hashtags por plataforma
    const platformHashtags = TRENDING_HASHTAGS_DATA.byPlatform[platform]?.slice(0, 3) || [];
    suggestions.push(...platformHashtags);

    // Hashtags por país
    if (country !== 'global' && TRENDING_HASHTAGS_DATA.byCountry[country]) {
        const countryHashtags = TRENDING_HASHTAGS_DATA.byCountry[country].slice(0, 2);
        suggestions.push(...countryHashtags);
    }

    // Calcular score combinado
    const scoredHashtags = suggestions.map(hashtag => {
        const growthScore = parseInt(hashtag.growth.replace('+', '').replace('%', ''));
        const usesScore = parseFloat(hashtag.uses.replace('M', '000000').replace('K', '000'));
        const viralScore = hashtag.viral_potential || 75;

        const combinedScore = (growthScore * 0.4) + (Math.log10(usesScore) * 10) + (viralScore * 0.3);

        return {
            ...hashtag,
            score: Math.round(combinedScore),
            recommendation: combinedScore > 200 ? 'Must Use' : combinedScore > 150 ? 'Recommended' : 'Optional'
        };
    });

    // Ordenar por score y devolver top 10
    return scoredHashtags
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((hashtag, index) => ({
            ...hashtag,
            rank: index + 1,
            category: index < 3 ? 'trending' : index < 6 ? 'niche' : 'support'
        }));
};

export default {
    TRENDING_HASHTAGS_DATA,
    generateSmartHashtags
};
