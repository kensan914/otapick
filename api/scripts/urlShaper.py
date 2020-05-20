def shapeCt(group_id, ct):
    if ct is None:
        return group_id, ct

    intCt = int(ct)
    if group_id == 1:
        if intCt < 10:
            return group_id, '0' + str(intCt)
        return group_id, str(intCt)
    elif group_id == 2:
        return group_id, str(intCt)

    return group_id, ct
