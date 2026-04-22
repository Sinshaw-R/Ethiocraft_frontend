"use client"
import React from 'react';
import GenericSection from './GenericSection';

export default function AnalyticsSection(props: any) {
  return <GenericSection title="Analytics" description={props.sectionDescriptions?.Analytics} {...props} />;
}
