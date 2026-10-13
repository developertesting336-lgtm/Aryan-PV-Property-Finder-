import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { budgetUsd, lifestyle, beachProximity, propertyType } = body;

    let matchedNeighborhood = 'Zona Romántica';
    let secondaryNeighborhood = 'Versalles';
    let matchPercentage = 95;
    let reason = 'You crave a vibrant, highly walkable neighborhood with premier gastronomy, art galleries, and direct access to Los Muertos Beach.';
    let averageNeighborhoodPrice = 450000;

    if (budgetUsd >= 1000000 || lifestyle === 'secluded_luxury') {
      matchedNeighborhood = 'Conchas Chinas';
      secondaryNeighborhood = 'Amapas';
      matchPercentage = 98;
      reason = 'You prioritize dramatic private ocean views, secluded rocky coves, and world-class architecture over bustling crowds.';
      averageNeighborhoodPrice = 1250000;
    } else if (lifestyle === 'boating_golf') {
      matchedNeighborhood = 'Marina Vallarta';
      secondaryNeighborhood = 'Fluvial Vallarta';
      matchPercentage = 96;
      reason = 'A tranquil nautical lifestyle with a 500-slip harbor, tree-shaded pedestrian boardwalks, championship golf, and top international schools.';
      averageNeighborhoodPrice = 590000;
    } else if (lifestyle === 'digital_nomad_foodie' || (budgetUsd < 400000 && propertyType === 'condo')) {
      matchedNeighborhood = 'Versalles';
      secondaryNeighborhood = '5 de Diciembre';
      matchPercentage = 94;
      reason = 'The gourmet culinary epicenter of Vallarta. High Airbnb rental occupancy, micro-roaster cafes, and phenomenal capital appreciation.';
      averageNeighborhoodPrice = 320000;
    } else if (lifestyle === 'family_residential') {
      matchedNeighborhood = 'Fluvial Vallarta';
      secondaryNeighborhood = 'Marina Vallarta';
      matchPercentage = 92;
      reason = 'Master-planned comfort with underground utilities, expansive green belt parks, top medical clinics, and modern amenities.';
      averageNeighborhoodPrice = 480000;
    }

    // Filter recommended properties
    const recommended: any[] = [];

    return NextResponse.json({
      matchedNeighborhood,
      matchPercentage,
      secondaryNeighborhood,
      reason,
      averageNeighborhoodPrice,
      recommendedProperties: recommended,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Quiz scoring failed' },
      { status: 500 }
    );
  }
}
