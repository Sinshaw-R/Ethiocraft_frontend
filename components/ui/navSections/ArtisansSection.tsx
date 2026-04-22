"use client"
import React from 'react';
import GenericSection from './GenericSection';

export default function ArtisansSection(props: any) {
  return <GenericSection title="Artisans" description={props.sectionDescriptions?.Artisans} {...props} />;
}
