import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

interface MapProps {
  districtStats: { district: string; challengesCount: number; activeProjects: number }[];
  onSelectDistrict?: (district: string) => void;
}

const normalizeDistrictName = (name: string) => {
  const lower = name.toLowerCase().trim();
  if (lower === 'purba singhbhum') return 'east singhbhum';
  if (lower === 'pashchimi singhbhum') return 'west singhbhum';
  if (lower === 'hazaribag') return 'hazaribagh';
  if (lower === 'saraikela-kharsawan') return 'saraikela kharsawan';
  if (lower === 'kodarma') return 'koderma';
  return lower;
};

export const JharkhandMap: React.FC<MapProps> = ({ districtStats, onSelectDistrict }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/shuklaneerajdev/IndiaStateTopojsonFiles/master/Jharkhand.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch map data');
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Jharkhand GeoJSON:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const width = 600;
    const height = 500;

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%')
      .attr('height', '100%');

    svg.selectAll('*').remove();

    // Create a projection fitting the bounding box
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    const maxChallenges = (d3.max(districtStats, (d: { challengesCount: number }) => d.challengesCount) || 1) as number;
    
    // Create a color scale
    const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, maxChallenges * 1.2]);

    const g = svg.append('g');

    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        const distName = d.properties.Dist_Name || '';
        const normalized = normalizeDistrictName(distName);
        const stat = districtStats.find((s) => s.district.toLowerCase() === normalized);
        // Base color if no challenges or no match
        if (!stat || stat.challengesCount === 0) return '#FAF7F2';
        return colorScale(stat.challengesCount);
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('transition', 'fill 0.2s, stroke 0.2s')
      .on('mouseover', function (event, d: any) {
        // Bring the hovered path to the front so the stroke doesn't get clipped by neighbors
        d3.select(this).raise();

        d3.select(this)
          .attr('stroke', '#1A1A1A')
          .attr('stroke-width', 2.5);

        const distName = d.properties.Dist_Name || '';
        const normalized = normalizeDistrictName(distName);
        const stat = districtStats.find((s) => s.district.toLowerCase() === normalized);

        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.innerHTML = `
            <div class="font-editorial-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-1 mb-2">${stat?.district || distName}</div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Challenges: <strong class="text-stone-900 ml-1">${stat?.challengesCount || 0}</strong></div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active Projects: <strong class="text-stone-900 ml-1">${stat?.activeProjects || 0}</strong></div>
          `;
        }
      })
      .on('mousemove', function (event) {
        if (tooltipRef.current) {
          // Adjust based on cursor using client coordinates since the tooltip is fixed
          tooltipRef.current.style.left = event.clientX + 15 + 'px';
          tooltipRef.current.style.top = event.clientY - 20 + 'px';
        }
      })
      .on('mouseout', function (event, d: any) {
        d3.select(this)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5);

        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      })
      .on('click', (event, d: any) => {
        const distName = d.properties.Dist_Name || '';
        const normalized = normalizeDistrictName(distName);
        const stat = districtStats.find((s) => s.district.toLowerCase() === normalized);
        if (stat && onSelectDistrict) {
          onSelectDistrict(stat.district);
        }
      });

      // Optional text labels for districts
      /*
      g.selectAll('text')
        .data(geoData.features)
        .enter()
        .append('text')
        .attr('transform', (d: any) => \`translate(\${pathGenerator.centroid(d)})\`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', '#1a1a1a')
        .style('pointer-events', 'none')
        .text((d: any) => {
          const name = d.properties.Dist_Name || '';
          return name;
        });
      */
  }, [geoData, districtStats, onSelectDistrict]);

  if (error) return <div className="p-8 text-center text-sm text-red-500 font-medium">Map data failed to load.</div>;
  
  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
      <svg ref={svgRef} className="w-full h-full drop-shadow-sm"></svg>
      {/* Tooltip portal */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none opacity-0 bg-white border border-slate-200 shadow-xl rounded-lg p-3 text-sm z-50 transition-opacity duration-150"
        style={{ left: 0, top: 0, minWidth: '150px' }}
      ></div>
    </div>
  );
};
