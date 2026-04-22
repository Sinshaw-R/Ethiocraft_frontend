"use client"
import React from 'react';
import GenericSection from './GenericSection';

export default function UsersSection(props: any) {
  return <GenericSection title="Users" description={props.sectionDescriptions?.Users} {...props} />;
}
