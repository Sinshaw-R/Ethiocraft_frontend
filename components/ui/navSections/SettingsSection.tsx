"use client"
import React from 'react';
import GenericSection from './GenericSection';

export default function SettingsSection(props: any) {
  return <GenericSection title="Settings" description={props.sectionDescriptions?.Settings} {...props} />;
}
