const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const BugModel = require('../models/bugModel');

const createBug = async (req, res) => {
  try {
    if (req.user.role !== 'tester') {
      return res.status(403).json({ message: '403 Forbidden. Developers cannot create bugs.' });
    }

    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({ message: 'Title, description, and priority are required.' });
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    const formattedPriority = priority.toUpperCase();
    if (!validPriorities.includes(formattedPriority)) {
      return res.status(400).json({ message: 'Invalid priority. Allowed values: LOW, MEDIUM, HIGH.' });
    }

    let bug_screenshot = null;
    let bug_video = null;

    if (req.files) {
      if (req.files.bug_screenshot && req.files.bug_screenshot.length > 0) {
        bug_screenshot = `/uploads/${req.files.bug_screenshot[0].filename}`;
      }
      if (req.files.bug_video && req.files.bug_video.length > 0) {
        bug_video = `/uploads/${req.files.bug_video[0].filename}`;
      }
    }

    const newBug = await BugModel.create({
      title,
      description,
      priority: formattedPriority,
      created_by: req.user.id,
      bug_screenshot,
      bug_video
    });

    return res.status(201).json({
      message: 'Bug created successfully',
      bug: newBug
    });
  } catch (error) {
    console.error('Create bug error:', error);
    return res.status(500).json({ message: 'Server error while creating bug.' });
  }
};

const getBugs = async (req, res) => {
  try {
    const { status, assigned_to } = req.query;
    let assignedFilter = assigned_to;
    
    // Securely bind 'me' to the authenticated JWT user ID
    if (assigned_to === 'me' && req.user) {
      assignedFilter = req.user.id;
    }

    const bugs = await BugModel.getAll({ status, assigned_to: assignedFilter });
    return res.status(200).json(bugs);
  } catch (error) {
    console.error('Get bugs error:', error);
    return res.status(500).json({ message: 'Server error while fetching bugs.' });
  }
};

const getBugById = async (req, res) => {
  try {
    const bugId = req.params.id;
    const bug = await BugModel.getById(bugId);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found.' });
    }

    return res.status(200).json(bug);
  } catch (error) {
    console.error('Get bug by ID error:', error);
    return res.status(500).json({ message: 'Server error while fetching bug details.' });
  }
};

const assignBug = async (req, res) => {
  try {
    if (req.user.role !== 'developer') {
      return res.status(403).json({ message: '403 Forbidden. Only developers can assign bugs.' });
    }

    const bugId = req.params.id;
    const bug = await BugModel.getById(bugId);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found.' });
    }

    if (bug.assigned_to !== null) {
      return res.status(409).json({ message: '409 Conflict. Bug is already assigned to another user.' });
    }

    const updatedBug = await BugModel.assignToUser(bugId, req.user.id);

    return res.status(200).json({
      message: 'Bug assigned successfully',
      bug: updatedBug
    });
  } catch (error) {
    console.error('Assign bug error:', error);
    return res.status(500).json({ message: 'Server error while assigning bug.' });
  }
};

const changeStatus = async (req, res) => {
  try {
    if (req.user.role !== 'developer') {
      return res.status(403).json({ message: '403 Forbidden. Only developers can update bug status.' });
    }

    const bugId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const validStatuses = ['IN_PROGRESS', 'FIXED'];
    const formattedStatus = status.toUpperCase();
    if (!validStatuses.includes(formattedStatus)) {
      return res.status(400).json({ message: 'Invalid status. Allowed values: IN_PROGRESS, FIXED.' });
    }

    const bug = await BugModel.getById(bugId);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found.' });
    }

    // Check if the logged-in user is the assigned user
    if (bug.assigned_to !== req.user.id) {
      return res.status(403).json({ message: '403 Forbidden. Only the assigned developer can change bug status.' });
    }

    // Enforce linear status flow: Must be IN_PROGRESS before marking FIXED
    if (formattedStatus === 'FIXED' && bug.status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: '400 Bad Request. Bug must be IN_PROGRESS before it can be marked as FIXED. Please assign the bug to yourself first.' });
    }

    const updatedBug = await BugModel.updateStatus(bugId, formattedStatus);

    return res.status(200).json({
      message: 'Bug status updated successfully',
      bug: updatedBug
    });
  } catch (error) {
    console.error('Change status error:', error);
    return res.status(500).json({ message: 'Server error while updating bug status.' });
  }
};

module.exports = {
  createBug,
  getBugs,
  getBugById,
  assignBug,
  changeStatus
};
