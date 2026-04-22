"use client"
import React from 'react';
import GenericSection from './GenericSection';

export default function ReportsSection(props: any) {
  return <GenericSection title="Reports" description={props.sectionDescriptions?.Reports} {...props} />;
}
