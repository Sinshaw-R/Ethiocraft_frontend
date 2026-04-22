"use client"
import React from 'react';
import GenericSection from './GenericSection';

export default function ApprovalsSection(props: any) {
  return <GenericSection title="Approvals" description={props.sectionDescriptions?.Approvals} {...props} />;
}
