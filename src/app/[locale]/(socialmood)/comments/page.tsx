"use client"
import React from 'react'
import CommentsDisplay from "@/components/(socialmood)/comments-test";

function CommentsPage() {
  return (
    <CommentsDisplay
    postIds={['420988084437583_122106060254537178']}
    pageAccessToken='EAAMMIc9laBwBO8aCHbjVxdZCgcTE8itpZCeFIvAMu9A7kDpEYbyZCZA8UVNUDBTLUuEfzfi6RpG4pZAPnmuI38k9ZCXQFe7UvPf7QQ9OfQTM8pb1f9VRYizozeaRS7RQigOVNnTZCqjZAbs5rYQuoQvmC5ZAjNNKZATxDqPV39PLxNdu2ZAhxSDtjvOYZArg2gHTaWiL'
    since='123'
    />
  )
}

export default CommentsPage