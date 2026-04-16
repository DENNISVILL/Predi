import { lazy } from 'react';

// Lazy loading de módulos principales para optimizar rendimiento
export const LazyExploreTrendsModule = lazy(() => import('./ExploreTrendsModule'));
export const LazyPredictiveActionsModule = lazy(() => import('./PredictiveActionsModule'));
export const LazyAlertsModule = lazy(() => import('./AlertsModule'));
export const LazyConfigurationModule = lazy(() => import('./ConfigurationModule'));
export const LazyTrendAnalysisDetail = lazy(() => import('./TrendAnalysisDetail'));

// Lazy loading de componentes pesados
export const LazyChartComponents = lazy(() => import('./charts/ChartComponents'));
export const LazyDataVisualization = lazy(() => import('./visualization/DataVisualization'));

// Lazy loading de componentes de terceros
export const LazyReactCharts = lazy(() => 
  import('react-chartjs-2').then(module => ({ default: module }))
);

export default {
  LazyExploreTrendsModule,
  LazyPredictiveActionsModule,
  LazyAlertsModule,
  LazyConfigurationModule,
  LazyTrendAnalysisDetail,
  LazyChartComponents,
  LazyDataVisualization,
  LazyReactCharts
};
