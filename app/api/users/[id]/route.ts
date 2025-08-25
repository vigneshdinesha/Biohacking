import { NextRequest, NextResponse } from 'next/server'

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { firstname, lastname, email, provider, externalid, subid, motivationid } = body

    console.log(`Updating user ${userId} with data:`, { motivationid, ...body })

    // TODO: Replace this with actual database update
    // Example with Prisma:
    // const updatedUser = await prisma.users.update({
    //   where: { id: userId },
    //   data: {
    //     firstname,
    //     lastname,
    //     email,
    //     provider,
    //     externalid,
    //     subid,
    //     motivationid,
    //     updateddate: new Date()
    //   }
    // })
    //
    // Example with raw SQL:
    // const result = await db.query(`
    //   UPDATE users 
    //   SET firstname = $1, lastname = $2, email = $3, provider = $4, 
    //       externalid = $5, subid = $6, motivationid = $7, updateddate = NOW()
    //   WHERE id = $8
    //   RETURNING *
    // `, [firstname, lastname, email, provider, externalid, subid, motivationid, userId])

    // Mock response for now
    const updatedUser = {
      id: userId,
      firstname: firstname || '',
      lastname: lastname || '',
      email: email || '',
      provider: provider || '',
      externalid: externalid || '',
      subid: subid || '',
      motivationid: motivationid || null,
      updateddate: new Date().toISOString()
    }

    console.log('Mock user updated:', updatedUser)
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
