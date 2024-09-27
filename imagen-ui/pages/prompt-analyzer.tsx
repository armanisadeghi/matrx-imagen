import React from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

const PromptAnalysisDashboard = () => {
  // Sample data - replace with actual data from prompt analysis
  const categoryData = [
    { name: 'Subject', value: 30 },
    { name: 'Style', value: 25 },
    { name: 'Mood', value: 20 },
    { name: 'Technical', value: 15 },
    { name: 'Color', value: 10 },
  ];

  const wordTypeData = [
    { type: 'Nouns', count: 15 },
    { type: 'Verbs', count: 8 },
    { type: 'Adjectives', count: 20 },
    { type: 'Adverbs', count: 5 },
    { type: 'Prepositions', count: 7 },
  ];

  const sentimentData = [
    { sentiment: 'Positive', score: 0.6 },
    { sentiment: 'Neutral', score: 0.3 },
    { sentiment: 'Negative', score: 0.1 },
  ];

  const complexityData = [
    { aspect: 'Vocabulary', score: 75 },
    { aspect: 'Grammar', score: 60 },
    { aspect: 'Structure', score: 80 },
    { aspect: 'Concepts', score: 70 },
  ];

  // Dynamic chart config with custom CSS colors
  const chartConfig = {
    categoryData: {
      visitors: 'value',
      Subject: { label: 'Subject', color: 'hsl(var(--chart-1))' },
      Style: { label: 'Style', color: 'hsl(var(--chart-2))' },
      Mood: { label: 'Mood', color: 'hsl(var(--chart-3))' },
      Technical: { label: 'Technical', color: 'hsl(var(--chart-4))' },
      Color: { label: 'Color', color: 'hsl(var(--chart-5))' },
    },
    wordTypeData: {
      visitors: 'count',
      Nouns: { label: 'Nouns', color: 'hsl(var(--chart-1))' },
      Verbs: { label: 'Verbs', color: 'hsl(var(--chart-2))' },
      Adjectives: { label: 'Adjectives', color: 'hsl(var(--chart-3))' },
      Adverbs: { label: 'Adverbs', color: 'hsl(var(--chart-4))' },
      Prepositions: { label: 'Prepositions', color: 'hsl(var(--chart-5))' },
    },
    sentimentData: {
      visitors: 'score',
      Positive: { label: 'Positive', color: 'hsl(var(--chart-1))' },
      Neutral: { label: 'Neutral', color: 'hsl(var(--chart-2))' },
      Negative: { label: 'Negative', color: 'hsl(var(--chart-3))' },
    },
    complexityData: {
      visitors: 'score',
      Vocabulary: { label: 'Vocabulary', color: 'hsl(var(--chart-1))' },
      Grammar: { label: 'Grammar', color: 'hsl(var(--chart-2))' },
      Structure: { label: 'Structure', color: 'hsl(var(--chart-3))' },
      Concepts: { label: 'Concepts', color: 'hsl(var(--chart-4))' },
    },
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Distribution of prompt elements</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[200px]" config={chartConfig.categoryData}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey={chartConfig.categoryData.visitors}
                nameKey="name"
                label
                fill={({ name }) => chartConfig.categoryData[name]?.color}
              />
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Word Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Word Type Analysis</CardTitle>
          <CardDescription>Distribution of word types used</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[200px]" config={chartConfig.wordTypeData}>
            <BarChart data={wordTypeData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={chartConfig.wordTypeData.visitors}
                fill={({ type }) => chartConfig.wordTypeData[type]?.color}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Overall sentiment of the prompt</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[200px]" config={chartConfig.sentimentData}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey={chartConfig.sentimentData.visitors}
                nameKey="sentiment"
                label
                fill={({ sentiment }) => chartConfig.sentimentData[sentiment]?.color}
              />
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Complexity Score */}
      <Card>
        <CardHeader>
          <CardTitle>Complexity Score</CardTitle>
          <CardDescription>Measure of prompt complexity</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[200px]" config={chartConfig.complexityData}>
            <RadarChart data={complexityData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="aspect" />
              <Radar
                dataKey={chartConfig.complexityData.visitors}
                fill={({ aspect }) => chartConfig.complexityData[aspect]?.color}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptAnalysisDashboard;


/*
[
  {
    "prompt": "still life art by Samuel Peploe and Posuka Demizu, erotisch, lasziv, petite-lithe Persian goddess...",
    "elements": {
      "subject_matter": ["Still life", "Persian goddess", "Abandoned city", "Earthly water", "Natural surroundings", "Rippled waves"],
      "style_references": ["Samuel Peploe", "Posuka Demizu", "Scottish Colourist", "Still life", "Landscapes", "Manga", "Intricate", "Detailed illustrations"],
      "descriptors": ["Erotisch", "Lasziv", "Petite-lithe", "Long curly hair", "Golden brown eyes", "Shimmering light", "Contemplations"],
      "action_scene": ["Sun setting", "Shimmering light reflecting", "Waves transforming"],
      "lighting_atmosphere": ["Shimmering", "Sunset", "Reflective", "Deep contemplation"],
      "concept_theme": ["Fantasy", "Adventure", "Surrealism"],
      "detail_level": "Intricate"
    }
  },
  {
    "prompt": "A cute kitten looking in the mirror and seeing an elegant lion reflection, high resolution, highly detailed...",
    "elements": {
      "subject_matter": ["Kitten", "Mirror", "Lion reflection"],
      "style_references": ["Photorealistic", "Cinematic"],
      "descriptors": ["Cute", "Elegant", "High resolution", "Highly detailed"],
      "action_scene": ["Kitten looking into mirror", "Seeing lion reflection"],
      "lighting_atmosphere": ["Cinematic"],
      "concept_theme": ["Transformation", "Introspection"],
      "detail_level": "Highly detailed"
    }
  },
  {
    "prompt": "A Charred Blue Morpho Butterfly with a tiny Mechanical Legs and piercing dark pink eyes gazes intently...",
    "elements": {
      "subject_matter": ["Charred Blue Morpho Butterfly", "Mechanical legs", "Piercing dark pink eyes", "Flipped crimson hair"],
      "style_references": ["Sci-fi", "Surrealism"],
      "descriptors": ["Charred", "Blue", "Mechanical", "Piercing dark pink eyes", "Crimson hair"],
      "action_scene": ["Gazing at camera", "Hair blowing in the wind"],
      "lighting_atmosphere": ["Implied cinematic"],
      "concept_theme": ["Surrealism", "Transformation", "Sci-fi"],
      "detail_level": "Highly detailed"
    }
  }
]
*/

/*
{
  "subject_matter_count": 6,
  "style_references_count": 7,
  "descriptor_density": 7,
  "action_intensity": 3,
  "lighting_complexity": 4,
  "theme_count": 3,
  "detail_level_score": 9
}
*/